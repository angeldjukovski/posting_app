import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser } from '../type/current-user.interface';

export const GetUser = createParamDecorator(
  (data: keyof CurrentUser | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user: CurrentUser = request.user;
    return data ? user[data] : user;
  },
);
