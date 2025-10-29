import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment, AppointmentStatus } from '../../entities/appointment.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) { }

  @Get()
  async findAll(@Query() paginationDto?: PaginationDto): Promise<PaginatedResponseDto<Appointment>> {
    return await this.appointmentService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Appointment | null> {
    return await this.appointmentService.findOne(id);
  }

  @Post()
  async create(@Body() appointmentData: Partial<Appointment>): Promise<Appointment> {
    return await this.appointmentService.create(appointmentData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() appointmentData: Partial<Appointment>,
  ): Promise<Appointment | null> {
    return await this.appointmentService.update(id, appointmentData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.appointmentService.remove(id);
  }

  @Get('customer/:customerId')
  async findByCustomer(@Param('customerId', ParseIntPipe) customerId: number): Promise<Appointment[]> {
    return await this.appointmentService.findByCustomer(customerId);
  }

  @Get('staff/:staffId')
  async findByStaff(@Param('staffId', ParseIntPipe) staffId: number): Promise<Appointment[]> {
    return await this.appointmentService.findByStaff(staffId);
  }

  @Get('date-range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ): Promise<Appointment[]> {
    return await this.appointmentService.findByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: AppointmentStatus): Promise<Appointment[]> {
    return await this.appointmentService.findByStatus(status);
  }

  @Get('upcoming')
  async getUpcomingAppointments(@Query('days') days: number = 7): Promise<Appointment[]> {
    return await this.appointmentService.getUpcomingAppointments(days);
  }
}