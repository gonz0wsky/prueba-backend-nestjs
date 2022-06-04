import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from 'src/user/models/user.models';
import { CreateIdeaType, IdeaType, UpdateIdeaType } from './models/idea.models';

@Injectable()
export class IdeaService {
  constructor(private prisma: PrismaService) {}

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
}
