import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // Return data from the request object
    // @GetUser("data") user: User
    if (data) {
      return request.user[data];
    }

    return request.user;
  },
);
