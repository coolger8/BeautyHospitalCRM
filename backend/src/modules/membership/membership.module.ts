import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from '../../entities/membership.entity';
import { Customer } from '../../entities/customer.entity';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { RepositoriesModule } from '../../repositories/repositories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Membership, Customer]),
    RepositoriesModule
  ],
  providers: [MembershipService],
  controllers: [MembershipController],
  exports: [MembershipService]
})
export class MembershipModule {}