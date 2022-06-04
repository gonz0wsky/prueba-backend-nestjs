import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserResolver } from './user/user.resolver';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { APP_GUARD } from '@nestjs/core';
import { GqlAuthGuard } from './common';
import { IdeaModule } from './idea/idea.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      sortSchema: true,
      debug: false,
      playground: true,
    }),
    UserModule,
    AuthModule,
    PrismaModule,
    CommonModule,
    IdeaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
    UserResolver,
  ],
})
export class AppModule {}
