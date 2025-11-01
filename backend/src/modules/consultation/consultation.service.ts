import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation } from '../../entities/consultation.entity';
import { Customer } from '../../entities/customer.entity';
import { Staff } from '../../entities/staff.entity';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) { }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResponseDto<Consultation>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await this.consultationRepository.findAndCount({
      skip,
      take: limit,
      relations: ['customer', 'consultant'],
      order: { createdAt: 'DESC' }
    });

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: number): Promise<Consultation | null> {
    return await this.consultationRepository.findOne({
      where: { id },
      relations: ['customer', 'consultant']
    });
  }

  async create(consultationData: Partial<Consultation>): Promise<Consultation> {
    const consultation = this.consultationRepository.create(consultationData);
    return await this.consultationRepository.save(consultation);
  }

  async update(id: number, consultationData: Partial<Consultation>): Promise<Consultation | null> {
    await this.consultationRepository.update(id, consultationData);
    return await this.consultationRepository.findOne({
      where: { id },
      relations: ['customer', 'consultant']
    });
  }

  async remove(id: number): Promise<void> {
    await this.consultationRepository.delete(id);
  }

  async findByCustomer(customerId: number): Promise<Consultation[]> {
    return await this.consultationRepository.find({
      where: { customerId },
      relations: ['customer', 'consultant']
    });
  }

  async findByConsultant(consultantId: number): Promise<Consultation[]> {
    return await this.consultationRepository.find({
      where: { consultantId },
      relations: ['customer', 'consultant']
    });
  }

  async searchByContent(searchTerm: string): Promise<Consultation[]> {
    return await this.consultationRepository
      .createQueryBuilder('consultation')
      .leftJoinAndSelect('consultation.customer', 'customer')
      .leftJoinAndSelect('consultation.consultant', 'consultant')
      .where('consultation.communicationContent LIKE :term', { term: `%${searchTerm}%` })
      .orWhere('consultation.diagnosisContent LIKE :term', { term: `%${searchTerm}%` })
      .getMany();
  }
}