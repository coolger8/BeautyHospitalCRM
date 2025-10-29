import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Consultation } from './consultation.entity';

export enum StaffRole {
  CONSULTANT = 'consultant',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  ADMIN = 'admin'
}

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({
    type: 'text',
    default: 'consultant'
  })
  role: StaffRole;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Consultation, consultation => consultation.consultant)
  consultations: Consultation[];

  // Using string references to break circular dependency
  @OneToMany('Appointment', 'assignedStaff')
  appointments: any[];

  // Using string references to break circular dependency
  @OneToMany('Treatment', 'doctor')
  treatments: any[];
}