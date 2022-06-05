import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FollowerResolver } from './follower.resolver';
import { FollowerService } from './follower.service';

@Module({
  imports: [PrismaModule],
  providers: [FollowerResolver, FollowerService],
})
export class FollowerModule {}
