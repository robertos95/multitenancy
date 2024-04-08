import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TENANT_DATA_SOURCE } from '../tenancy/tenancy.module';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TaskService {
  private readonly taskRepository: Repository<Task>;

  constructor(@Inject(TENANT_DATA_SOURCE) dataSource: DataSource) {
    this.taskRepository = dataSource.getRepository(Task);
  }

  async create(createTaskDto: CreateTaskDto) {
    let task = this.taskRepository.create({
      ...createTaskDto,
      status: TaskStatus.OPEN,
    });
    task = await this.taskRepository.save(task);

    return task;
  }

  async getTasks(): Promise<Task[]> {
    const tasks = await this.taskRepository.find();
    return tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);

    return this.taskRepository.save(Object.assign(task, { ...updateTaskDto }));
  }
}
