import { Field, HideField, ID, InputType, ObjectType } from '@nestjs/graphql';
import { FollowRequest as FollowRequestModel } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserType } from 'src/user/models/user.models';

@ObjectType()
export class FollowRequestType implements FollowRequestModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  fromId: string;

  @Field(() => ID)
  toId: string;

  @Field(() => UserType)
  from: UserType;

  @Field(() => UserType)
  to: UserType;

  @HideField()
  createdAt: Date;

  @HideField()
  updatedAt: Date;
}

@InputType()
export class CreateFollowRequestType {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}
