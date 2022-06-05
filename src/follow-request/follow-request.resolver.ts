import { Connection, Edge } from '@devoxa/prisma-relay-cursor-connection';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FollowRequest } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import { GetUser } from 'src/common';
import { UserType } from 'src/user/models/user.models';
import { FollowRequestService } from './follow-request.service';
import { FollowRequestConnection } from './models/follow-request.connections';
import {
  AcceptFollowRequestType,
  CreateFollowRequestType,
  ListFollowRequestsType,
  RejectFollowRequestType,
} from './models/follow-request.models';

@Resolver('FollowRequest')
export class FollowRequestResolver {
  constructor(private followRequestService: FollowRequestService) {}

  @Query(() => FollowRequestConnection)
  async listFollowRequests(
    @Args('input', {
      type: () => ListFollowRequestsType,
      description: 'List user follow requests',
    })
    input: ListFollowRequestsType,
    @GetUser()
    user: UserType,
    @Info() resolveInfo: GraphQLResolveInfo,
  ): Promise<Connection<FollowRequest, Edge<FollowRequest>>> {
    return this.followRequestService.listFollowRequests(
      input,
      user,
      resolveInfo,
    );
  }

  @Mutation(() => Boolean)
  async sendFollowRequest(
    @Args('input', {
      type: () => CreateFollowRequestType,
      description: 'Send a follow request to a user',
    })
    input: CreateFollowRequestType,
    @GetUser() user: UserType,
  ): Promise<boolean> {
    return this.followRequestService.createFollowRequest(input.id, user);
  }

  @Mutation(() => Boolean)
  async acceptFollowRequest(
    @Args('input', {
      type: () => AcceptFollowRequestType,
      description: 'Accept a follow request',
    })
    input: AcceptFollowRequestType,
    @GetUser() user: UserType,
  ): Promise<boolean> {
    return this.followRequestService.acceptFollowRequest(input.id, user);
  }

  @Mutation(() => Boolean)
  async rejectFollowRequest(
    @Args('input', {
      type: () => RejectFollowRequestType,
      description: 'Reject a follow request',
    })
    input: RejectFollowRequestType,
    @GetUser() user: UserType,
  ): Promise<boolean> {
    return this.followRequestService.rejectFollowRequest(input.id, user);
  }
}
