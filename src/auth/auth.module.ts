import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  providers: [AuthResolver, AuthService, JwtStrategy],
})
export class AuthModule {}
