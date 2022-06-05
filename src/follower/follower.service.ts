import { Connection, Edge } from '@devoxa/prisma-relay-cursor-connection';
import { Injectable } from '@nestjs/common';
import { Follower } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from 'src/user/models/user.models';
import { ListFollowerType } from './models/follower.models';

@Injectable()
export class FollowerService {
  constructor(private prisma: PrismaService) {}

  async listFollowers(
    input: ListFollowerType,
    user: UserType,
    resolveInfo: GraphQLResolveInfo,
  ): Promise<Connection<Follower, Edge<Follower>>> {
    try {
      const followers = await this.prisma.findManyCursorConnection(
        (args) =>
          this.prisma.follower.findMany({
            ...args,
            where: { toId: user.id },
            orderBy: { createdAt: 'desc' },
            include: { from: true, to: true },
          }),
        () => this.prisma.follower.count({ where: { toId: user.id } }),
        input,
        { resolveInfo },
      );
      return followers;
    } catch (error) {
      throw error;
    }
  }

  async listFollowing(
    input: ListFollowerType,
    user: UserType,
    resolveInfo: GraphQLResolveInfo,
  ): Promise<Connection<Follower, Edge<Follower>>> {
    try {
      const following = await this.prisma.findManyCursorConnection(
        (args) =>
          this.prisma.follower.findMany({
            ...args,
            where: { fromId: user.id },
            orderBy: { createdAt: 'desc' },
            include: { from: true, to: true },
          }),
        () => this.prisma.follower.count({ where: { fromId: user.id } }),
        input,
        { resolveInfo },
      );
      return following;
    } catch (error) {
      throw error;
    }
  }
}
