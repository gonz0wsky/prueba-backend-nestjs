import { ObjectType } from '@nestjs/graphql';
import { Connection } from 'src/common/relay.connection';
import { IdeaType } from './idea.models';

@ObjectType()
export class IdeaConnection extends Connection(IdeaType) {}
