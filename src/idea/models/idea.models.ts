import {
  Field,
  HideField,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Idea as IdeaModel, IdeaVisibility } from '@prisma/client';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

registerEnumType(IdeaVisibility, {
  name: 'IdeaVisibilityType',
});

@ObjectType()
export class IdeaType implements IdeaModel {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  authorId: string;

  @Field(() => IdeaVisibility)
  visibility: IdeaVisibility;

  @HideField()
  createdAt: Date;

  @HideField()
  updatedAt: Date;
}

@InputType()
export class CreateIdeaType {
  @Field()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Field(() => IdeaVisibility)
  @IsEnum(IdeaVisibility)
  @IsNotEmpty()
  visibility: IdeaVisibility;
}
