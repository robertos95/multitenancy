import { Body, Controller, Get, Post } from '@nestjs/common';
import { TenantCredentialsDto } from './dto/login.dto';
import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('/signup')
  signup(@Body() signupDto: TenantCredentialsDto) {
    return this.tenantService.signup(signupDto);
  }

  @Get('/login')
  login(@Body() loginDto: TenantCredentialsDto) {
    return this.tenantService.login(loginDto);
  }
}
