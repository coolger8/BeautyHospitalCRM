import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentMethod } from '../../entities/order.entity';
import { Customer } from '../../entities/customer.entity';
import { Project } from '../../entities/project.entity';
import { Staff } from '../../entities/staff.entity';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) { }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResponseDto<Order>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await this.orderRepository.findAndCount({
      skip,
      take: limit,
      relations: ['customer', 'project', 'consultant', 'discountApprover'],
      order: { id: 'ASC' }
    });

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: number): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'project', 'consultant', 'discountApprover']
    });
  }

  async create(orderData: Partial<Order>): Promise<Order> {
    // Calculate final amount if not provided
    if (!orderData.finalAmount && orderData.amount) {
      orderData.finalAmount = orderData.amount - (orderData.discountAmount || 0);
    }

    const order = this.orderRepository.create(orderData);
    return await this.orderRepository.save(order);
  }

  async update(id: number, orderData: Partial<Order>): Promise<Order | null> {
    await this.orderRepository.update(id, orderData);
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'project', 'consultant', 'discountApprover']
    });
  }

  async count(): Promise<number> {
    return this.orderRepository.count();
  }

  async generateTestData(count: number = 20): Promise<Order[]> {
    const orders: Order[] = [];

    // 获取现有客户、项目和员工
    const customers = await this.customerRepository.find({ take: 20 });
    const projects = await this.projectRepository.find({ take: 20 });
    const staffs = await this.staffRepository.find({ take: 20 });

    if (customers.length === 0 || projects.length === 0 || staffs.length === 0) {
      throw new Error('需要先创建客户、项目和员工数据');
    }

    const statuses = Object.values(OrderStatus);
    const paymentMethods = Object.values(PaymentMethod);

    for (let i = 0; i < count; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const project = projects[Math.floor(Math.random() * projects.length)];
      const staff = staffs[Math.floor(Math.random() * staffs.length)];

      const amount = Math.floor(Math.random() * 10000) + 500;
      const discountAmount = Math.floor(Math.random() * 500);
      const finalAmount = amount - discountAmount;

      // 随机创建日期（过去90天内）
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 90));

      const order = new Order();
      order.customerId = customer.id;
      order.projectId = project.id;
      order.consultantId = staff.id;
      order.amount = amount;
      order.discountAmount = discountAmount;
      order.finalAmount = finalAmount;
      order.status = statuses[Math.floor(Math.random() * statuses.length)];
      order.paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      orders.push(order);
    }

    return this.orderRepository.save(orders);
  }

  async remove(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }

  async findByCustomer(customerId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { customerId },
      relations: ['customer', 'project', 'consultant', 'discountApprover']
    });
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { status },
      relations: ['customer', 'project', 'consultant', 'discountApprover']
    });
  }

  async findByPaymentMethod(paymentMethod: PaymentMethod): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { paymentMethod },
      relations: ['customer', 'project', 'consultant', 'discountApprover']
    });
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.project', 'project')
      .leftJoinAndSelect('order.consultant', 'consultant')
      .leftJoinAndSelect('order.discountApprover', 'discountApprover')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();
  }

  async getRevenueReport(startDate: Date, endDate: Date): Promise<any> {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.finalAmount)', 'totalRevenue')
      .addSelect('COUNT(order.id)', 'orderCount')
      .addSelect('order.paymentMethod', 'paymentMethod')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('order.status = :status', { status: OrderStatus.PAID })
      .groupBy('order.paymentMethod')
      .getRawMany();

    const totalRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.finalAmount)', 'totalRevenue')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('order.status = :status', { status: OrderStatus.PAID })
      .getRawOne();

    const topProjects = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.project', 'project')
      .select('project.name', 'projectName')
      .addSelect('COUNT(order.id)', 'orderCount')
      .addSelect('SUM(order.finalAmount)', 'totalRevenue')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('order.status = :status', { status: OrderStatus.PAID })
      .groupBy('project.id')
      .addGroupBy('project.name')
      .orderBy('totalRevenue', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      revenueByPaymentMethod: orders,
      totalRevenue: totalRevenue?.totalRevenue || 0,
      topProjects
    };
  }

  async getCustomerReport(customerId: number): Promise<any> {
    const orders = await this.orderRepository.find({
      where: { customerId },
      relations: ['project']
    });

    const totalSpent = orders.reduce((sum, order) => sum + order.finalAmount, 0);
    const orderCount = orders.length;

    const projectCounts = {};
    orders.forEach(order => {
      const projectName = order.project?.name || 'Unknown';
      projectCounts[projectName] = (projectCounts[projectName] || 0) + 1;
    });

    return {
      customerId,
      totalSpent,
      orderCount,
      projectDistribution: projectCounts
    };
  }
}