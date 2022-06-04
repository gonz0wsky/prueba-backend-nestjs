import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from 'src/user/models/user.models';
import { CreateIdeaType, IdeaType } from './models/idea.models';

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
}
