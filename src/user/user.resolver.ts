import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GetUser, GqlAuthGuard } from 'src/common';
import { UserType } from './models/user.model';

@Resolver()
export class UserResolver {
  @Query(() => UserType)
  @UseGuards(GqlAuthGuard)
  async me(@GetUser() user: UserType): Promise<UserType> {
    return user;
  }
}
