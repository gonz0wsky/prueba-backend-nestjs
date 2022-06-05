import { Module } from '@nestjs/common';
import { FollowRequestService } from './follow-request.service';
import { FollowRequestResolver } from './follow-request.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FollowRequestService, FollowRequestResolver],
})
export class FollowRequestModule {}
