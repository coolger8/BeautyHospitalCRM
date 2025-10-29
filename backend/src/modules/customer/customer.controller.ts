import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer, CustomerSource, CustomerValueLevel, ConsumptionLevel, DemandType } from '../../entities/customer.entity';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto
  ): Promise<PaginatedResponseDto<Customer>> {
    return await this.customerService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Customer | null> {
    return await this.customerService.findOne(id);
  }

  @Post()
  async create(@Body() customerData: Partial<Customer>): Promise<Customer> {
    return await this.customerService.create(customerData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() customerData: Partial<Customer>,
  ): Promise<Customer | null> {
    return await this.customerService.update(id, customerData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.customerService.remove(id);
  }

  @Get('phone/:phone')
  async findByPhone(@Param('phone') phone: string): Promise<Customer | null> {
    return await this.customerService.findByPhone(phone);
  }

  @Get('search/:name')
  async searchByName(@Param('name') name: string): Promise<Customer[]> {
    return await this.customerService.searchByName(name);
  }

  @Get('value-level/:level')
  async getCustomersByValueLevel(
    @Param('level') level: CustomerValueLevel,
  ): Promise<Customer[]> {
    return await this.customerService.getCustomersByValueLevel(level);
  }

  @Get('demand-type/:demandType')
  async getCustomersByDemandType(
    @Param('demandType') demandType: DemandType,
  ): Promise<Customer[]> {
    return await this.customerService.getCustomersByDemandType(demandType);
  }

  @Get('source/:source')
  async getCustomersBySource(
    @Param('source') source: CustomerSource,
  ): Promise<Customer[]> {
    return await this.customerService.getCustomersBySource(source);
  }
}