import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { TreatmentService } from './treatment.service';
import { Treatment } from '../../entities/treatment.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Controller('treatments')
export class TreatmentController {
  constructor(private readonly treatmentService: TreatmentService) { }

  @Get()
  async findAll(@Query() paginationDto?: PaginationDto): Promise<PaginatedResponseDto<Treatment>> {
    return await this.treatmentService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Treatment | null> {
    return await this.treatmentService.findOne(id);
  }

  @Post()
  async create(@Body() treatmentData: Partial<Treatment>): Promise<Treatment> {
    return await this.treatmentService.create(treatmentData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() treatmentData: Partial<Treatment>,
  ): Promise<Treatment | null> {
    return await this.treatmentService.update(id, treatmentData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.treatmentService.remove(id);
  }

  @Get('customer/:customerId')
  async findByCustomer(@Param('customerId', ParseIntPipe) customerId: number): Promise<Treatment[]> {
    return await this.treatmentService.findByCustomer(customerId);
  }

  @Get('doctor/:doctorId')
  async findByDoctor(@Param('doctorId', ParseIntPipe) doctorId: number): Promise<Treatment[]> {
    return await this.treatmentService.findByDoctor(doctorId);
  }

  @Get('consultation/:consultationId')
  async findByConsultation(@Param('consultationId', ParseIntPipe) consultationId: number): Promise<Treatment[]> {
    return await this.treatmentService.findByConsultation(consultationId);
  }

  @Get('history/:customerId')
  async getTreatmentHistory(@Param('customerId', ParseIntPipe) customerId: number): Promise<Treatment[]> {
    return await this.treatmentService.getTreatmentHistory(customerId);
  }

  @Get('upcoming')
  async getUpcomingTreatments(@Query('days') days: number = 7): Promise<Treatment[]> {
    return await this.treatmentService.getUpcomingTreatments(days);
  }
}