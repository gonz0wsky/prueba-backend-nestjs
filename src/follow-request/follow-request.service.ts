import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from 'src/user/models/user.models';

@Injectable()
export class FollowRequestService {
  constructor(private prisma: PrismaService) {}

  async createFollowRequest(id: string, user: UserType): Promise<boolean> {
    try {
      const userToFollow = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!userToFollow) throw new ForbiddenException("User doesn't exist");

      const followRequest = await this.prisma.followRequest.findMany({
        where: {
          fromId: user.id,
          toId: id,
        },
      });

      if (followRequest.length > 0)
        throw new ForbiddenException('You already sent a follow request');

      const followers = await this.prisma.follower.findMany({
        where: {
          fromId: user.id,
          toId: id,
        },
      });

      if (followers.length > 0)
        throw new ForbiddenException('You are already following this user');

      await this.prisma.followRequest.create({
        data: {
          fromId: user.id,
          toId: id,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
}
