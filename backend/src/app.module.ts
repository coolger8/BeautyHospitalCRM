import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ConsultationModule } from './modules/consultation/consultation.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { TreatmentModule } from './modules/treatment/treatment.module';
import { MembershipModule } from './modules/membership/membership.module';
import { CampaignModule } from './modules/campaign/campaign.module';
import { OrderModule } from './modules/order/order.module';
import { AuthModule } from './modules/auth/auth.module';
import { StaffModule } from './modules/staff/staff.module';
import { RepositoriesModule } from './repositories/repositories.module';
// import { GrpcModule } from './grpc/grpc.module'; // 暂时注释掉，避免gRPC启动错误

@Module({
  imports: [
    DatabaseModule,
    RepositoriesModule,
    CustomerModule,
    ConsultationModule,
    AppointmentModule,
    TreatmentModule,
    MembershipModule,
    CampaignModule,
    OrderModule,
    AuthModule,
    StaffModule,
    // GrpcModule // 暂时注释掉，避免gRPC启动错误
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
