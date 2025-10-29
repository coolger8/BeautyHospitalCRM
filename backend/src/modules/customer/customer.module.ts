import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../../entities/customer.entity';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { RepositoriesModule } from '../../repositories/repositories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    RepositoriesModule
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService]
})
export class CustomerModule {}