import { ConnectionArguments } from '@devoxa/prisma-relay-cursor-connection';
import { Field, HideField, ID, InputType, ObjectType } from '@nestjs/graphql';
import { FollowRequest as FollowRequestModel } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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

@InputType()
export class AcceptFollowRequestType {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}

@InputType()
export class RejectFollowRequestType {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}

@InputType()
export class ListFollowRequestsType implements ConnectionArguments {
  @Field(() => ID, { nullable: true })
  @IsString()
  @IsOptional()
  after?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  first?: number;

  @Field(() => ID, { nullable: true })
  @IsString()
  @IsOptional()
  before?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  last?: number;
}
