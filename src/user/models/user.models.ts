import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { User as UserModel } from '@prisma/client';

@ObjectType()
export class UserType implements UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  firstName: string;

  @Field({ nullable: true })
  lastName: string | null;

  @Field()
  email: string;

  @Field()
  token: string;

  @HideField()
  hash: string;

  @HideField()
  createdAt: Date;

  @HideField()
  updatedAt: Date;
}
