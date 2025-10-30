import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { Campaign } from '../../entities/campaign.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) { }

  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page?: number,
    @Query('limit', ParseIntPipe) limit?: number
  ): Promise<PaginatedResponseDto<Campaign>> {
    const paginationDto = new PaginationDto();
    if (page) paginationDto.page = page;
    if (limit) paginationDto.limit = limit;
    return await this.campaignService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Campaign | null> {
    return await this.campaignService.findOne(id);
  }

  @Post()
  async create(@Body() campaignData: Partial<Campaign>): Promise<Campaign> {
    return await this.campaignService.create(campaignData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() campaignData: Partial<Campaign>,
  ): Promise<Campaign | null> {
    return await this.campaignService.update(id, campaignData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.campaignService.remove(id);
  }

  @Get('active')
  async findActiveCampaigns(): Promise<Campaign[]> {
    return await this.campaignService.findActiveCampaigns();
  }

  @Get('upcoming')
  async findUpcomingCampaigns(): Promise<Campaign[]> {
    return await this.campaignService.findUpcomingCampaigns();
  }

  @Get('expired')
  async findExpiredCampaigns(): Promise<Campaign[]> {
    return await this.campaignService.findExpiredCampaigns();
  }
}