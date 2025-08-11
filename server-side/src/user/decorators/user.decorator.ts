import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'prisma/generated';

export const CurrentUser = createParamDecorator(
  (data: keyof User, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return data ? user[data] : user;
  },
);
