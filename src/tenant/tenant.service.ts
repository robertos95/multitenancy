import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async login(loginDto: LoginDto) {
    const tenant = await this.findOne(loginDto);

    return tenant.id;
  }

  async findOne(loginDto: LoginDto) {
    const tenant = await this.tenantRepository.findOne({
      where: {
        username: loginDto.username,
        password: loginDto.password,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }
}
