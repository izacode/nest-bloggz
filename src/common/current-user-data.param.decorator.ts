import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserData = createParamDecorator(
  (data: unknown, context: ExecutionContext): Object => {
    const request = context.switchToHttp().getRequest();
   
    const { sub, username, email } = request.user;

    return { sub, username, email };
  },
);
