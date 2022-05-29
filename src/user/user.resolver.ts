import { Query, Resolver } from '@nestjs/graphql';
import { UserType } from './models/user.model';

@Resolver()
export class UserResolver {
  @Query(() => UserType)
  async me(): Promise<UserType> {
    return {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'mail@mail.com',
      token: 'token',
      hash: 'hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
