import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GetUser } from 'src/common';
import { UserType } from 'src/user/models/user.models';
import { FollowRequestService } from './follow-request.service';
import {
  AcceptFollowRequestType,
  CreateFollowRequestType,
  FollowRequestType,
  RejectFollowRequestType,
} from './models/follow-request.models';

@Resolver('FollowRequest')
export class FollowRequestResolver {
  constructor(private followRequestService: FollowRequestService) {}

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
