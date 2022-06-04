import {
  Field,
  HideField,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Idea as IdeaModel, IdeaVisibility } from '@prisma/client';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

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

@InputType()
export class UpdateIdeaType {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  content?: string;

  @Field(() => IdeaVisibility, { nullable: true })
  @IsEnum(IdeaVisibility)
  @IsOptional()
  visibility?: IdeaVisibility;
}
