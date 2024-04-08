import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenancyModule, TENANT_DATA_SOURCE } from '../tenancy/tenancy.module';
import { Task } from './entities/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

export const ASYNC_TASK_SERVICE = Symbol('ASYNC_TASK_SERVICE');

@Module({
  imports: [TypeOrmModule.forFeature([Task]), TenancyModule],
  controllers: [TaskController],
  providers: [
    {
      provide: ASYNC_TASK_SERVICE,
      useFactory: async (svc: TaskService) => {
        return svc;
      },
      inject: [TENANT_DATA_SOURCE],
    },
    TaskService,
  ],
})
export class TaskModule {}
