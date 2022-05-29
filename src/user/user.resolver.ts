import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { GqlAuthGuard } from 'src/auth/guard';
import { UserType } from './models/user.model';

@Resolver()
export class UserResolver {
  @Query(() => UserType)
  @UseGuards(GqlAuthGuard)
  async me(@GetUser() user: UserType): Promise<UserType> {
    return user;
  }
}
