import { Module } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaResolver } from './idea.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [IdeaService, IdeaResolver],
})
export class IdeaModule {}
