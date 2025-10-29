import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CustomerModule } from '../modules/customer/customer.module';
import { ConsultationModule } from '../modules/consultation/consultation.module';
import { AppointmentModule } from '../modules/appointment/appointment.module';
import { TreatmentModule } from '../modules/treatment/treatment.module';
import { MembershipModule } from '../modules/membership/membership.module';
import { CampaignModule } from '../modules/campaign/campaign.module';
import { OrderModule } from '../modules/order/order.module';
import { AuthModule } from '../modules/auth/auth.module';

@Module({
  imports: [
    CustomerModule,
    ConsultationModule,
    AppointmentModule,
    TreatmentModule,
    MembershipModule,
    CampaignModule,
    OrderModule,
    AuthModule,
    ClientsModule.register([
      {
        name: 'CUSTOMER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'customer',
          protoPath: join(__dirname, '../proto/customer.proto'),
        },
      },
      {
        name: 'CONSULTATION_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'consultation',
          protoPath: join(__dirname, '../proto/consultation.proto'),
        },
      },
      {
        name: 'APPOINTMENT_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'appointment',
          protoPath: join(__dirname, '../proto/appointment.proto'),
        },
      },
      {
        name: 'TREATMENT_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'treatment',
          protoPath: join(__dirname, '../proto/treatment.proto'),
        },
      },
      {
        name: 'MEMBERSHIP_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'membership',
          protoPath: join(__dirname, '../proto/membership.proto'),
        },
      },
      {
        name: 'CAMPAIGN_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'campaign',
          protoPath: join(__dirname, '../proto/campaign.proto'),
        },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'order',
          protoPath: join(__dirname, '../proto/order.proto'),
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, '../proto/auth.proto'),
        },
      },
    ]),
  ],
})
export class GrpcModule {}