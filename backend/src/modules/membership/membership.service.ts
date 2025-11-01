import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from '../../entities/membership.entity';
import { Customer } from '../../entities/customer.entity';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) { }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResponseDto<Membership>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await this.membershipRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: number): Promise<Membership | null> {
    return await this.membershipRepository.findOne({
      where: { id }
    });
  }

  async findByCustomer(customerId: number): Promise<Membership | null> {
    return await this.membershipRepository.findOne({
      where: { customerId }
    });
  }

  async create(membershipData: Partial<Membership>): Promise<Membership> {
    const membership = this.membershipRepository.create(membershipData);
    return await this.membershipRepository.save(membership);
  }

  async update(id: number, membershipData: Partial<Membership>): Promise<Membership | null> {
    await this.membershipRepository.update(id, membershipData);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.membershipRepository.delete(id);
  }

  async count(): Promise<number> {
    return this.membershipRepository.count();
  }

  async generateTestData(count: number = 20): Promise<Membership[]> {
    const memberships: Membership[] = [];

    // 获取现有客户
    const customers = await this.customerRepository.find({ take: count });

    if (customers.length === 0) {
      throw new Error('需要先创建客户数据');
    }

    const levels = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];

    for (let i = 0; i < Math.min(count, customers.length); i++) {
      const customer = customers[i];

      // 随机会员等级
      const level = levels[Math.floor(Math.random() * levels.length)];

      // 根据等级设置积分和余额
      let points = 0;
      let balance = 0;

      switch (level) {
        case 'bronze':
          points = Math.floor(Math.random() * 1000);
          balance = Math.floor(Math.random() * 500);
          break;
        case 'silver':
          points = Math.floor(Math.random() * 3000) + 1000;
          balance = Math.floor(Math.random() * 1000) + 500;
          break;
        case 'gold':
          points = Math.floor(Math.random() * 5000) + 3000;
          balance = Math.floor(Math.random() * 2000) + 1000;
          break;
        case 'platinum':
          points = Math.floor(Math.random() * 10000) + 5000;
          balance = Math.floor(Math.random() * 5000) + 2000;
          break;
        case 'diamond':
          points = Math.floor(Math.random() * 20000) + 10000;
          balance = Math.floor(Math.random() * 10000) + 5000;
          break;
      }

      // 随机过期日期（1-3年内）
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + Math.floor(Math.random() * 2) + 1);

      const membership = new Membership();
      membership.customerId = customer.id;
      membership.level = level as any; // 临时修复类型问题
      membership.points = points;
      membership.balance = balance;
      membership.expiryDate = expiryDate;
      membership.isActive = Math.random() > 0.1; // 90% 概率为活跃状态

      memberships.push(membership);
    }

    return this.membershipRepository.save(memberships);
  }
}