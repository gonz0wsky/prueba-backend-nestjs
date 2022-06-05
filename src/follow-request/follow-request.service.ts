import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
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

  async acceptFollowRequest(id: string, user: UserType): Promise<boolean> {
    try {
      const followRequests = await this.prisma.followRequest.findMany({
        where: {
          id: id,
          toId: user.id,
        },
      });

      const followRequest = followRequests[0];

      if (!followRequest)
        throw new ForbiddenException('Follow request not found');

      const deleteFollowRequest = this.prisma.followRequest.delete({
        where: { id },
      });

      const createFollower = this.prisma.follower.create({
        data: {
          fromId: followRequest.fromId,
          toId: followRequest.toId,
        },
      });

      await this.prisma.$transaction([deleteFollowRequest, createFollower]);

      return true;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ForbiddenException('Follow request not found');
        }
      }
      throw error;
    }
  }

  async rejectFollowRequest(id: string, user: UserType): Promise<boolean> {
    try {
      await this.prisma.followRequest.deleteMany({
        where: {
          id,
          fromId: user.id,
        },
      });

      return true;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ForbiddenException('Follow request not found');
        }
      }
      throw error;
    }
  }
}
