import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    private jwtService: JwtService,
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

  async login({ username, password }: TenantCredentialsDto) {
    const tenant = await this.tenantRepository.findOne({
      where: {
        username,
      },
    });

    if (tenant && (await bcrypt.compare(password, tenant.password))) {
      const payload = {
        userId: tenant.id,
      };

      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid username or password');
    }
  }
}
