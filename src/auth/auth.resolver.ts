import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserType } from 'src/user/models/user.model';
import { LoginType, RegisterType } from './models/auth.models';

@Resolver()
export class AuthResolver {
  @Mutation(() => UserType)
  async login(
    @Args({ name: 'input', type: () => LoginType }) input: LoginType,
  ): Promise<UserType> {
    const { email } = input;
    return {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email,
      token: 'token',
    };
  }

  @Mutation(() => UserType)
  async register(
    @Args({ name: 'input', type: () => RegisterType }) input: RegisterType,
  ): Promise<UserType> {
    const { email, firstName, lastName } = input;
    return {
      id: '1',
      firstName,
      lastName,
      email,
      token: 'token',
    };
  }
}
