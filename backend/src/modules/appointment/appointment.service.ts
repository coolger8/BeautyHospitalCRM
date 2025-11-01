import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../../entities/appointment.entity';
import { Customer } from '../../entities/customer.entity';
import { Staff } from '../../entities/staff.entity';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) { }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResponseDto<Appointment>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await this.appointmentRepository.findAndCount({
      skip,
      take: limit,
      relations: ['customer', 'assignedStaff'],
      order: { createdAt: 'DESC' }
    });

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: number): Promise<Appointment | null> {
    return await this.appointmentRepository.findOne({
      where: { id },
      relations: ['customer', 'assignedStaff']
    });
  }

  async create(appointmentData: Partial<Appointment>): Promise<Appointment> {
    const appointment = this.appointmentRepository.create(appointmentData);
    return await this.appointmentRepository.save(appointment);
  }

  async update(id: number, appointmentData: Partial<Appointment>): Promise<Appointment | null> {
    await this.appointmentRepository.update(id, appointmentData);
    return await this.appointmentRepository.findOne({
      where: { id },
      relations: ['customer', 'assignedStaff']
    });
  }

  async remove(id: number): Promise<void> {
    await this.appointmentRepository.delete(id);
  }

  async findByCustomer(customerId: number): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { customerId },
      relations: ['customer', 'assignedStaff']
    });
  }

  async findByStaff(staffId: number): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { assignedStaffId: staffId },
      relations: ['customer', 'assignedStaff']
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    return await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.customer', 'customer')
      .leftJoinAndSelect('appointment.assignedStaff', 'staff')
      .where('appointment.scheduledTime BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();
  }

  async findByStatus(status: AppointmentStatus): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { status },
      relations: ['customer', 'assignedStaff']
    });
  }

  async getUpcomingAppointments(days: number = 7): Promise<Appointment[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.customer', 'customer')
      .leftJoinAndSelect('appointment.assignedStaff', 'staff')
      .where('appointment.scheduledTime BETWEEN :today AND :futureDate', {
        today,
        futureDate
      })
      .orderBy('appointment.scheduledTime', 'ASC')
      .getMany();
  }
}