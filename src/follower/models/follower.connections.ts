import { ObjectType } from '@nestjs/graphql';
import { Connection } from 'src/common/relay.connection';
import { FollowerType } from './follower.models';

@ObjectType()
export class FollowerConnection extends Connection(FollowerType) {}
