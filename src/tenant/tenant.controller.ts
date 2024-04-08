import { Body, Controller, Get } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { TenantService } from './tenant.service';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('/login')
  login(@Body() loginDto: LoginDto) {
    return this.tenantService.login(loginDto);
  }
}
