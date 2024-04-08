import { createParamDecorator } from '@nestjs/common';
import { Tenant } from './entities/tenant.entity';

export const GetTenant = createParamDecorator((_data, ctx): Tenant => {
  const request = ctx.switchToHttp().getRequest();

  return request.user;
});
