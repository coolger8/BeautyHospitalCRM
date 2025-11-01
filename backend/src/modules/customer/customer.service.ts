import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, CustomerSource, CustomerValueLevel, ConsumptionLevel, DemandType } from '../../entities/customer.entity';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) { }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResponseDto<Customer>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await this.customerRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: number): Promise<Customer | null> {
    return await this.customerRepository.findOne({ where: { id } });
  }

  async create(customerData: Partial<Customer>): Promise<Customer> {
    const customer = this.customerRepository.create(customerData);
    return await this.customerRepository.save(customer);
  }

  async update(id: number, customerData: Partial<Customer>): Promise<Customer | null> {
    await this.customerRepository.update(id, customerData);
    return await this.customerRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.customerRepository.delete(id);
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    return await this.customerRepository.findOne({ where: { phone } });
  }

  async searchByName(name: string): Promise<Customer[]> {
    return await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.name LIKE :name', { name: `%${name}%` })
      .getMany();
  }

  async getCustomersByValueLevel(level: CustomerValueLevel): Promise<Customer[]> {
    return await this.customerRepository.find({ where: { valueLevel: level } });
  }

  async getCustomersByDemandType(demandType: DemandType): Promise<Customer[]> {
    return await this.customerRepository.find({ where: { demandType } });
  }

  async getCustomersBySource(source: CustomerSource): Promise<Customer[]> {
    return await this.customerRepository.find({ where: { source } });
  }
}