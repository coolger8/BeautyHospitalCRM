import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Customer } from './customer.entity';
import { Staff } from './staff.entity';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @Column()
  assignedStaffId: number;

  @Column()
  projectId: number;

  @Column({ type: 'datetime' })
  scheduledTime: Date;

  @Column({
    type: 'text',
    default: 'pending'
  })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Customer, customer => customer.appointments)
  customer: Customer;

  @ManyToOne(() => Staff, staff => staff.appointments)
  assignedStaff: Staff;
}