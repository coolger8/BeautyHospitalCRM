import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, MoreThan, LessThan } from 'typeorm';
import { Campaign } from '../../entities/campaign.entity';
import { faker } from '@faker-js/faker';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) { }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResponseDto<Campaign>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await this.campaignRepository.findAndCount({
      skip,
      take: limit,
      order: { id: 'ASC' }
    });

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: number): Promise<Campaign | null> {
    return await this.campaignRepository.findOne({ where: { id } });
  }

  async create(campaignData: Partial<Campaign>): Promise<Campaign> {
    const campaign = this.campaignRepository.create(campaignData);
    return await this.campaignRepository.save(campaign);
  }

  async update(id: number, campaignData: Partial<Campaign>): Promise<Campaign | null> {
    await this.campaignRepository.update(id, campaignData);
    return await this.campaignRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.campaignRepository.delete(id);
  }

  async findActiveCampaigns(): Promise<Campaign[]> {
    const today = new Date();
    return await this.campaignRepository.find({
      where: [
        { isActive: true, startDate: LessThanOrEqual(today), endDate: MoreThanOrEqual(today) }
      ]
    });
  }

  async findUpcomingCampaigns(): Promise<Campaign[]> {
    const today = new Date();
    return await this.campaignRepository.find({
      where: { startDate: MoreThan(today) },
      order: { startDate: 'ASC' }
    });
  }

  async count(): Promise<number> {
    return this.campaignRepository.count();
  }

  async generateTestData(count: number = 20): Promise<Campaign[]> {
    const campaigns: Campaign[] = [];

    const campaignNames = [
      'Summer Beauty Special', 'New Year New You', 'Valentine\'s Day Package',
      'Mother\'s Day Promotion', 'Holiday Glow Up', 'Back to School Refresh',
      'Anniversary Celebration', 'Spring Renewal', 'Fall Facial Series',
      'Winter Skin Rescue', 'Bridal Beauty Package', 'Men\'s Grooming Special',
      'Teen Skincare Promotion', 'Anti-Aging Focus Month', 'Hydration Boost Week',
      'Acne Treatment Special', 'Luxury Spa Experience', 'Quick Lunchtime Treatments',
      'Weekend Wellness Package', 'VIP Client Appreciation'
    ];

    const descriptions = [
      'Get summer-ready with our special beauty treatments',
      'Start the new year with a refreshed look and feel',
      'Look your best for that special someone',
      'Treat mom to a day of beauty and relaxation',
      'Get that holiday glow with our special treatments',
      'Refresh your look before heading back to school',
      'Celebrating our anniversary with special pricing',
      'Renew your skin for spring with these treatments',
      'Fall in love with your skin again',
      'Combat winter dryness with these specialized treatments',
      'Look your best for your big day',
      'Specialized treatments designed for men',
      'Help teens develop good skincare habits',
      'Focus on turning back the clock with these treatments',
      'Boost your skin\'s hydration levels',
      'Targeted treatments for problematic skin',
      'Experience the ultimate in luxury treatments',
      'Quick treatments that fit into your busy schedule',
      'Weekend packages for ultimate relaxation',
      'Special pricing for our valued VIP clients'
    ];

    const today = new Date();

    for (let i = 0; i < count; i++) {
      // Create random start date (between 30 days ago and 30 days in future)
      const startDate = new Date();
      startDate.setDate(today.getDate() - Math.floor(Math.random() * 30) + Math.floor(Math.random() * 60));

      // Create random end date (between 7 and 90 days after start date)
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 83) + 7);

      const campaign = new Campaign();
      campaign.name = campaignNames[i % campaignNames.length];
      campaign.description = descriptions[i % descriptions.length];
      campaign.startDate = startDate;
      campaign.endDate = endDate;
      campaign.targetCustomerCriteria = JSON.stringify({
        minAge: Math.floor(Math.random() * 30) + 18,
        maxAge: Math.floor(Math.random() * 30) + 48,
        gender: Math.random() > 0.7 ? 'all' : (Math.random() > 0.5 ? 'female' : 'male'),
        minVisits: Math.floor(Math.random() * 5)
      });

      // Random discount (either percentage or fixed amount)
      if (Math.random() > 0.5) {
        campaign.discountPercentage = Math.floor(Math.random() * 30) + 5;
        campaign.fixedDiscount = 0;
      } else {
        campaign.discountPercentage = 0;
        campaign.fixedDiscount = Math.floor(Math.random() * 200) + 50;
      }

      campaign.isActive = Math.random() > 0.2; // 80% chance of being active

      campaigns.push(campaign);
    }

    return this.campaignRepository.save(campaigns);
  }

  async findExpiredCampaigns(): Promise<Campaign[]> {
    const today = new Date();
    return await this.campaignRepository.find({
      where: { endDate: LessThan(today) }
    });
  }
}