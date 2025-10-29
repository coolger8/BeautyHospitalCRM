import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultation } from '../../entities/consultation.entity';
import { Customer } from '../../entities/customer.entity';
import { Staff } from '../../entities/staff.entity';
import { ConsultationService } from './consultation.service';
import { ConsultationController } from './consultation.controller';
import { RepositoriesModule } from '../../repositories/repositories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consultation, Customer, Staff]),
    RepositoriesModule
  ],
  providers: [ConsultationService],
  controllers: [ConsultationController],
  exports: [ConsultationService]
})
export class ConsultationModule {}