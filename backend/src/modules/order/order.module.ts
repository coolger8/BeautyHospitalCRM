import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../entities/order.entity';
import { Customer } from '../../entities/customer.entity';
import { Project } from '../../entities/project.entity';
import { Staff } from '../../entities/staff.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { RepositoriesModule } from '../../repositories/repositories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Customer, Project, Staff]),
    RepositoriesModule
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService]
})
export class OrderModule {}