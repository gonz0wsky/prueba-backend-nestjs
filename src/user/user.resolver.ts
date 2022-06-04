import { Query, Resolver } from '@nestjs/graphql';
import { GetUser } from 'src/common';
import { UserType } from './models/user.models';

@Resolver('User')
export class UserResolver {
  @Query(() => UserType)
  async me(@GetUser() user: UserType): Promise<UserType> {
    return user;
  }
}
