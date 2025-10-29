import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Treatment } from '../../entities/treatment.entity';
import { Customer } from '../../entities/customer.entity';
import { Staff } from '../../entities/staff.entity';
import { Consultation } from '../../entities/consultation.entity';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class TreatmentService {
  constructor(
    @InjectRepository(Treatment)
    private treatmentRepository: Repository<Treatment>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,
  ) { }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResponseDto<Treatment>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await this.treatmentRepository.findAndCount({
      skip,
      take: limit,
      relations: ['customer', 'consultation', 'doctor', 'nurse'],
      order: { id: 'ASC' }
    });

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: number): Promise<Treatment | null> {
    return await this.treatmentRepository.findOne({
      where: { id },
      relations: ['customer', 'consultation', 'doctor', 'nurse']
    });
  }

  async create(treatmentData: Partial<Treatment>): Promise<Treatment> {
    const treatment = this.treatmentRepository.create(treatmentData);
    return await this.treatmentRepository.save(treatment);
  }

  async update(id: number, treatmentData: Partial<Treatment>): Promise<Treatment | null> {
    await this.treatmentRepository.update(id, treatmentData);
    return await this.treatmentRepository.findOne({
      where: { id },
      relations: ['customer', 'consultation', 'doctor', 'nurse']
    });
  }

  async remove(id: number): Promise<void> {
    await this.treatmentRepository.delete(id);
  }

  async findByCustomer(customerId: number): Promise<Treatment[]> {
    return await this.treatmentRepository.find({
      where: { customerId },
      relations: ['customer', 'consultation', 'doctor', 'nurse']
    });
  }

  async findByDoctor(doctorId: number): Promise<Treatment[]> {
    return await this.treatmentRepository.find({
      where: { doctorId },
      relations: ['customer', 'consultation', 'doctor', 'nurse']
    });
  }

  async findByConsultation(consultationId: number): Promise<Treatment[]> {
    return await this.treatmentRepository.find({
      where: { consultationId },
      relations: ['customer', 'consultation', 'doctor', 'nurse']
    });
  }

  async getTreatmentHistory(customerId: number): Promise<Treatment[]> {
    return await this.treatmentRepository.find({
      where: { customerId },
      order: { treatmentTime: 'DESC' },
      relations: ['customer', 'consultation', 'doctor', 'nurse']
    });
  }

  async getUpcomingTreatments(days: number = 7): Promise<Treatment[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return await this.treatmentRepository
      .createQueryBuilder('treatment')
      .leftJoinAndSelect('treatment.customer', 'customer')
      .leftJoinAndSelect('treatment.consultation', 'consultation')
      .leftJoinAndSelect('treatment.doctor', 'doctor')
      .leftJoinAndSelect('treatment.nurse', 'nurse')
      .where('treatment.nextTreatmentTime BETWEEN :today AND :futureDate', {
        today,
        futureDate
      })
      .orderBy('treatment.nextTreatmentTime', 'ASC')
      .getMany();
  }
}