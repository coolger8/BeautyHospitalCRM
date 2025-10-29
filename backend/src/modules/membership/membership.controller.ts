import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { Membership, MembershipLevel } from '../../entities/membership.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) { }

  @Get()
  async findAll(@Query() paginationDto?: PaginationDto): Promise<PaginatedResponseDto<Membership>> {
    return await this.membershipService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Membership | null> {
    return await this.membershipService.findOne(id);
  }

  @Post()
  async create(@Body() membershipData: Partial<Membership>): Promise<Membership> {
    return await this.membershipService.create(membershipData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() membershipData: Partial<Membership>,
  ): Promise<Membership | null> {
    return await this.membershipService.update(id, membershipData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.membershipService.remove(id);
  }

  @Get('customer/:customerId')
  async findByCustomer(@Param('customerId', ParseIntPipe) customerId: number): Promise<Membership | null> {
    return await this.membershipService.findByCustomer(customerId);
  }


}