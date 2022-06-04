import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GetUser } from 'src/common';
import { UserType } from 'src/user/models/user.models';
import { IdeaService } from './idea.service';
import { CreateIdeaType, IdeaType, UpdateIdeaType } from './models/idea.models';

@Resolver('Idea')
export class IdeaResolver {
  constructor(private ideaService: IdeaService) {}

  @Mutation(() => IdeaType)
  async createIdea(
    @Args('input', {
      type: () => CreateIdeaType,
      description: 'Creates a new idea',
    })
    input: CreateIdeaType,
    @GetUser() user: UserType,
  ): Promise<IdeaType> {
    return this.ideaService.createIdea(input, user);
  }

  @Mutation(() => IdeaType)
  async updateIdea(
    @Args('input', {
      type: () => UpdateIdeaType,
      description: 'Updates an idea',
    })
    input: UpdateIdeaType,
    @GetUser() user: UserType,
  ): Promise<IdeaType> {
    return this.ideaService.updateIdea(input, user);
  }
}
