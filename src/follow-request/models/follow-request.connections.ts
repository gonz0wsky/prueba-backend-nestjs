import { ObjectType } from '@nestjs/graphql';
import { Connection } from 'src/common/relay.connection';
import { FollowRequestType } from './follow-request.models';

@ObjectType()
export class FollowRequestConnection extends Connection(FollowRequestType) {}
