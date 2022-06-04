import {
  Connection,
  Edge,
  findManyCursorConnection,
} from '@devoxa/prisma-relay-cursor-connection';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Idea } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from 'src/user/models/user.models';
import {
  CreateIdeaType,
  DeleteIdeaType,
  IdeaType,
  ListIdeaType,
  UpdateIdeaType,
} from './models/idea.models';

@Injectable()
export class IdeaService {
  constructor(private prisma: PrismaService) {}

  async listIdeas(
    input: ListIdeaType,
    user: UserType,
    resolveInfo: GraphQLResolveInfo,
  ): Promise<Connection<Idea, Edge<Idea>>> {
    try {
      const ideas = await findManyCursorConnection(
        (args) =>
          this.prisma.idea.findMany({
            ...args,
            where: { authorId: user.id },
            orderBy: { createdAt: 'desc' },
          }),
        () => this.prisma.idea.count({ where: { authorId: user.id } }),
        input,
        { resolveInfo },
      );
      return ideas;
    } catch (error) {
      throw error;
    }
  }

  async createIdea(input: CreateIdeaType, user: UserType): Promise<IdeaType> {
    try {
      const { content, visibility } = input;

      const idea = await this.prisma.idea.create({
        data: {
          content,
          visibility,
          authorId: user.id,
        },
      });
      return idea;
    } catch (error) {
      throw error;
    }
  }

  async updateIdea(input: UpdateIdeaType, user: UserType): Promise<IdeaType> {
    try {
      const idea = await this.prisma.idea.findUnique({
        where: { id: input.id },
      });

      if (!idea) throw new ForbiddenException('Idea not found');
      if (idea.authorId !== user.id)
        throw new UnauthorizedException('You cannot update this idea');

      const updatedIdea = await this.prisma.idea.update({
        where: { id: input.id },
        data: input,
      });

      return updatedIdea;
    } catch (error) {
      throw error;
    }
  }

  async deleteIdea(input: DeleteIdeaType, user: UserType): Promise<boolean> {
    try {
      const idea = await this.prisma.idea.findUnique({
        where: { id: input.id },
      });

      if (!idea) throw new ForbiddenException('Idea not found');
      if (idea.authorId !== user.id)
        throw new UnauthorizedException('You cannot delete this idea');

      await this.prisma.idea.delete({
        where: { id: input.id },
      });

      return true;
    } catch (error) {
      return error;
    }
  }
}
