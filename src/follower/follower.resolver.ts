import { Connection, Edge } from '@devoxa/prisma-relay-cursor-connection';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { Follower } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import { GetUser } from 'src/common';
import { UserType } from 'src/user/models/user.models';
import { FollowerService } from './follower.service';
import { FollowerConnection } from './models/follower.connections';
import { ListFollowerType } from './models/follower.models';

@Resolver('Follower')
export class FollowerResolver {
  constructor(private followerService: FollowerService) {}

  @Query(() => FollowerConnection)
  async listFollowers(
    @Args('input', {
      type: () => ListFollowerType,
      description: 'List followers',
    })
    input: ListFollowerType,
    @GetUser()
    user: UserType,
    @Info() resolveInfo: GraphQLResolveInfo,
  ): Promise<Connection<Follower, Edge<Follower>>> {
    return this.followerService.listFollowers(input, user, resolveInfo);
  }

  @Query(() => FollowerConnection)
  async listFollowing(
    @Args('input', {
      type: () => ListFollowerType,
      description: 'List following',
    })
    input: ListFollowerType,
    @GetUser()
    user: UserType,
    @Info() resolveInfo: GraphQLResolveInfo,
  ): Promise<Connection<Follower, Edge<Follower>>> {
    return this.followerService.listFollowing(input, user, resolveInfo);
  }
}
