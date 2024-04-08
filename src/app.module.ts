import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantModule } from './tenant/tenant.module';
import { TenancyModule } from './tenancy/tenancy.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: 'postgresql://postgres:password@localhost:5432/multitenant',
        entities: ['dist/**/*/*.entity{.ts,.js}'],
        // migrations: ['dist/migrations/*.js'],
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    TenantModule,
    TenancyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
