import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from '../../entities/campaign.entity';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { RepositoriesModule } from '../../repositories/repositories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign]),
    RepositoriesModule
  ],
  providers: [CampaignService],
  controllers: [CampaignController],
  exports: [CampaignService]
})
export class CampaignModule {}