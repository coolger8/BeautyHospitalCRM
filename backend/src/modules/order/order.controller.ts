import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order, OrderStatus, PaymentMethod } from '../../entities/order.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get()
  async findAll(@Query() paginationDto?: PaginationDto): Promise<PaginatedResponseDto<Order>> {
    return await this.orderService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Order | null> {
    return await this.orderService.findOne(id);
  }

  @Post()
  async create(@Body() orderData: Partial<Order>): Promise<Order> {
    return await this.orderService.create(orderData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() orderData: Partial<Order>,
  ): Promise<Order | null> {
    return await this.orderService.update(id, orderData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.orderService.remove(id);
  }

  @Get('customer/:customerId')
  async findByCustomer(@Param('customerId', ParseIntPipe) customerId: number): Promise<Order[]> {
    return await this.orderService.findByCustomer(customerId);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: OrderStatus): Promise<Order[]> {
    return await this.orderService.findByStatus(status);
  }

  @Get('payment-method/:paymentMethod')
  async findByPaymentMethod(@Param('paymentMethod') paymentMethod: PaymentMethod): Promise<Order[]> {
    return await this.orderService.findByPaymentMethod(paymentMethod);
  }

  @Get('date-range')
  async getOrdersByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ): Promise<Order[]> {
    return await this.orderService.getOrdersByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get('report/revenue')
  async getRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ): Promise<any> {
    return await this.orderService.getRevenueReport(new Date(startDate), new Date(endDate));
  }

  @Get('report/customer/:customerId')
  async getCustomerReport(@Param('customerId', ParseIntPipe) customerId: number): Promise<any> {
    return await this.orderService.getCustomerReport(customerId);
  }
}