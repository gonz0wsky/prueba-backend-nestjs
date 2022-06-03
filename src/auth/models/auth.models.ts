import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class SignInType {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}

@InputType()
export class SignUpType {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  firstName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  lastName?: string;
}

@InputType()
export class ChangePasswordType {
  @Field()
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

@InputType()
export class RequestResetPassowrdType {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;
}

@InputType()
export class ResetPasswordType {
  @Field()
  @IsString()
  @IsNotEmpty()
  token: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}
