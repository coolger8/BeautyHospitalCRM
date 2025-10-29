import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../entities/customer.entity';
import { Consultation } from '../entities/consultation.entity';
import { Appointment } from '../entities/appointment.entity';
import { Treatment } from '../entities/treatment.entity';
import { Staff } from '../entities/staff.entity';
import { Membership } from '../entities/membership.entity';
import { Project } from '../entities/project.entity';
import { Order } from '../entities/order.entity';
import { Campaign } from '../entities/campaign.entity';
import { SeederService } from './seeder.service';
import { RepositoriesModule } from '../repositories/repositories.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    RepositoriesModule
  ],
  providers: [SeederService],
  exports: [SeederService]
})
export class SeederModule {}