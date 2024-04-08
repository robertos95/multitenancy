import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { TenantCredentialsDto } from './dto/login.dto';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async signup({ username, password }: TenantCredentialsDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const tenant = this.tenantRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.tenantRepository.save(tenant);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(loginDto: TenantCredentialsDto) {
    const tenant = await this.tenantRepository.findOne({
      where: {
        username: loginDto.username,
      },
    });

    if (tenant && (await bcrypt.compare(loginDto.password, tenant.password))) {
      return 'success';
    } else {
      throw new UnauthorizedException('Invalid username or password');
    }
  }
}
