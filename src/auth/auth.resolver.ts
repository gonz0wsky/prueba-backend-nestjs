import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GetUser, Public } from 'src/common';
import { UserType } from 'src/user/models/user.model';
import { AuthService } from './auth.service';
import {
  ChangePasswordType,
  SignInType,
  SignUpType,
} from './models/auth.models';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => UserType)
  @Public()
  async signUp(
    @Args('input', {
      type: () => SignUpType,
      description: 'Creates a new user',
    })
    input: SignUpType,
  ): Promise<UserType> {
    return this.authService.signUp(input);
  }

  @Mutation(() => UserType)
  @Public()
  async signIn(
    @Args('input', { type: () => SignInType, description: 'Log in' })
    input: SignInType,
  ): Promise<UserType> {
    return this.authService.signIn(input);
  }

  @Mutation(() => Boolean)
  async changePassword(
    @Args('input', {
      type: () => ChangePasswordType,
      description: 'Change user password',
    })
    input: ChangePasswordType,
    @GetUser() user: UserType,
  ): Promise<boolean> {
    return this.authService.changePassword(input, user);
  }
}
