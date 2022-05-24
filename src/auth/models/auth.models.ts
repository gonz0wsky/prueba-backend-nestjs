import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginType {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class RegisterType {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;
}
