import { ConnectionArguments } from '@devoxa/prisma-relay-cursor-connection';
import { Field, HideField, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Follower as FollowerModel } from '@prisma/client';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { UserType } from 'src/user/models/user.models';

@ObjectType()
export class FollowerType implements FollowerModel {
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
export class ListFollowerType implements ConnectionArguments {
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
