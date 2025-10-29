import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Customer } from './customer.entity';
import { Staff } from './staff.entity';
import { Consultation } from './consultation.entity';

@Entity('treatments')
export class Treatment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @Column()
  consultationId: number;

  @Column()
  doctorId: number;

  @Column()
  nurseId: number;

  @Column()
  projectId: number;

  @Column()
  productName: string;

  @Column()
  dosage: string;

  @Column({ type: 'datetime' })
  treatmentTime: Date;

  @Column({ type: 'text', nullable: true })
  recoveryNotes: string;

  @Column({ nullable: true })
  rednessLevel: number;

  @Column({ type: 'text', nullable: true })
  customerFeedback: string;

  @Column({ type: 'datetime', nullable: true })
  nextTreatmentTime: Date;

  @Column({ default: 1 })
  treatmentSequence: number;

  @Column({ default: 1 })
  totalTreatments: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Customer, customer => customer.treatments)
  customer: Customer;

  @ManyToOne(() => Consultation, consultation => consultation.treatments)
  consultation: Consultation;

  @ManyToOne(() => Staff, staff => staff.treatments)
  doctor: Staff;

  @ManyToOne(() => Staff)
  nurse: Staff;
}