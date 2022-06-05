import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GetUser } from 'src/common';
import { UserType } from 'src/user/models/user.models';
import { FollowRequestService } from './follow-request.service';
import {
  CreateFollowRequestType,
  FollowRequestType,
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
}
