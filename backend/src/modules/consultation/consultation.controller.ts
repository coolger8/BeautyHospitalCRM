import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { Consultation } from '../../entities/consultation.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Controller('consultations')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) { }

  @Get()
  async findAll(@Query() paginationDto?: PaginationDto): Promise<PaginatedResponseDto<Consultation>> {
    return await this.consultationService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Consultation | null> {
    return await this.consultationService.findOne(id);
  }

  @Post()
  async create(@Body() consultationData: Partial<Consultation>): Promise<Consultation> {
    return await this.consultationService.create(consultationData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() consultationData: Partial<Consultation>,
  ): Promise<Consultation | null> {
    return await this.consultationService.update(id, consultationData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.consultationService.remove(id);
  }

  @Get('customer/:customerId')
  async findByCustomer(@Param('customerId', ParseIntPipe) customerId: number): Promise<Consultation[]> {
    return await this.consultationService.findByCustomer(customerId);
  }

  @Get('consultant/:consultantId')
  async findByConsultant(@Param('consultantId', ParseIntPipe) consultantId: number): Promise<Consultation[]> {
    return await this.consultationService.findByConsultant(consultantId);
  }

  @Get('search/:term')
  async searchByContent(@Param('term') searchTerm: string): Promise<Consultation[]> {
    return await this.consultationService.searchByContent(searchTerm);
  }
}