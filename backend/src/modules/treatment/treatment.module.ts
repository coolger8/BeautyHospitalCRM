import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treatment } from '../../entities/treatment.entity';
import { Customer } from '../../entities/customer.entity';
import { Staff } from '../../entities/staff.entity';
import { Consultation } from '../../entities/consultation.entity';
import { TreatmentService } from './treatment.service';
import { TreatmentController } from './treatment.controller';
import { RepositoriesModule } from '../../repositories/repositories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Treatment, Customer, Staff, Consultation]),
    RepositoriesModule
  ],
  providers: [TreatmentService],
  controllers: [TreatmentController],
  exports: [TreatmentService]
})
export class TreatmentModule {}