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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Consultation,
      Appointment,
      Treatment,
      Staff,
      Membership,
      Project,
      Order,
      Campaign
    ])
  ],
  exports: [
    TypeOrmModule.forFeature([
      Customer,
      Consultation,
      Appointment,
      Treatment,
      Staff,
      Membership,
      Project,
      Order,
      Campaign
    ])
  ]
})
export class RepositoriesModule {}