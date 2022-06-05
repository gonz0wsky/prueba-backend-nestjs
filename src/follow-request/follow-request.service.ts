import { Connection, Edge } from '@devoxa/prisma-relay-cursor-connection';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { FollowRequest } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { GraphQLResolveInfo } from 'graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from 'src/user/models/user.models';
import { ListFollowRequestsType } from './models/follow-request.models';

@Injectable()
export class FollowRequestService {
  constructor(private prisma: PrismaService) {}

  async listFollowRequests(
    input: ListFollowRequestsType,
    user: UserType,
    resolveInfo: GraphQLResolveInfo,
  ): Promise<Connection<FollowRequest, Edge<FollowRequest>>> {
    try {
      const followRequests = await this.prisma.findManyCursorConnection(
        (args) =>
          this.prisma.followRequest.findMany({
            ...args,
            where: { toId: user.id },
            orderBy: { createdAt: 'desc' },
            include: { from: true, to: true },
          }),
        () => this.prisma.followRequest.count({ where: { toId: user.id } }),
        input,
        { resolveInfo },
      );
      return followRequests;
    } catch (error) {
      throw error;
    }
  }

  async createFollowRequest(id: string, user: UserType): Promise<boolean> {
    try {
      if (user.id === id)
        throw new ForbiddenException('You can not follow yourself');

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
