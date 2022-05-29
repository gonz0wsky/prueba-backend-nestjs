import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserType } from 'src/user/models/user.model';

export const GetUser = createParamDecorator(
  (_, context: ExecutionContext): UserType => {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    const token = ctx
      .getContext()
      .req.headers.authorization.replace('Bearer ', '');
    return { ...user, token };
  },
);
