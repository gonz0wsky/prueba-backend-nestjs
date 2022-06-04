import { Connection, Edge } from '@devoxa/prisma-relay-cursor-connection';
import { Args, Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { Idea } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import { GetUser } from 'src/common';
import { UserType } from 'src/user/models/user.models';
import { IdeaService } from './idea.service';
import { IdeaConnection } from './models/idea.connection';
import {
  CreateIdeaType,
  DeleteIdeaType,
  IdeaType,
  ListIdeaType,
  UpdateIdeaType,
} from './models/idea.models';

@Resolver('Idea')
export class IdeaResolver {
  constructor(private ideaService: IdeaService) {}

  @Query(() => IdeaConnection)
  async listIdeas(
    @Args('input', {
      type: () => ListIdeaType,
      description: 'List user ideas',
    })
    input: ListIdeaType,
    @GetUser()
    user: UserType,
    @Info() resolveInfo: GraphQLResolveInfo,
  ): Promise<Connection<Idea, Edge<Idea>>> {
    return this.ideaService.listIdeas(input, user, resolveInfo);
  }

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

  @Mutation(() => Boolean)
  async deleteIdea(
    @Args('input', {
      type: () => DeleteIdeaType,
      description: 'Updates an idea',
    })
    input: DeleteIdeaType,
    @GetUser() user: UserType,
  ): Promise<boolean> {
    return this.ideaService.deleteIdea(input, user);
  }
}
