import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff, StaffRole } from '../../entities/staff.entity';
import * as bcrypt from 'bcrypt';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) { }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResponseDto<Staff>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await this.staffRepository.findAndCount({
      skip,
      take: limit,
      order: { id: 'ASC' }
    });

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: number): Promise<Staff | null> {
    return this.staffRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Staff | null> {
    return this.staffRepository.findOne({ where: { email } });
  }

  async create(staffData: Partial<Staff>): Promise<Staff> {
    const { password, ...rest } = staffData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = this.staffRepository.create({
      ...rest,
      password: hashedPassword,
    });

    return this.staffRepository.save(staff);
  }

  async update(id: number, staffData: Partial<Staff>): Promise<Staff | null> {
    const { password, ...rest } = staffData;
    let updateData: Partial<Staff> = { ...rest };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData = { ...updateData, password: hashedPassword };
    }

    await this.staffRepository.update(id, updateData);
    return this.staffRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.staffRepository.delete(id);
  }

  async generateTestData(): Promise<void> {
    const roles = Object.values(StaffRole);
    const defaultPassword = await bcrypt.hash('password123', 10);

    const testData: Partial<Staff>[] = [];
    for (let i = 1; i <= 20; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      testData.push({
        name: `Staff Member ${i}`,
        email: `staff${i}@example.com`,
        phone: `1380013800${i < 10 ? '0' + i : i}`,
        role,
        password: defaultPassword,
        isActive: Math.random() > 0.2, // 80% active
      });
    }

    await this.staffRepository.save(testData);
  }
}