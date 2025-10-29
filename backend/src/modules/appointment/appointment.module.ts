import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../../entities/appointment.entity';
import { Customer } from '../../entities/customer.entity';
import { Staff } from '../../entities/staff.entity';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { RepositoriesModule } from '../../repositories/repositories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Customer, Staff]),
    RepositoriesModule
  ],
  providers: [AppointmentService],
  controllers: [AppointmentController],
  exports: [AppointmentService]
})
export class AppointmentModule {}