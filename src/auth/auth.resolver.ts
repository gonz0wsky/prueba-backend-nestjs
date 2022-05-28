import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserType } from 'src/user/models/user.model';
import { AuthService } from './auth.service';
import { SignInType, SignUpType } from './models/auth.models';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => UserType)
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
  async signIn(
    @Args('input', { type: () => SignInType, description: 'Log in' })
    input: SignInType,
  ): Promise<UserType> {
    return this.authService.signIn(input);
  }
}
