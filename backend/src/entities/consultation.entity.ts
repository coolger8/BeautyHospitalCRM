import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from './customer.entity';

@Entity('consultations')
export class Consultation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @Column()
  consultantId: number;

  @Column({ type: 'text' })
  communicationContent: string;

  @Column({ nullable: true })
  recommendedProject: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  quotedPrice: number;

  @Column({ nullable: true })
  communicationScreenshot: string;

  @Column({ nullable: true })
  referenceImage: string;

  @Column({ nullable: true })
  diagnosisContent: string;

  @Column({ nullable: true })
  skinTestResult: string;

  @Column({ nullable: true })
  aestheticDesign: string;

  @Column({ nullable: true })
  preoperativePhoto: string;

  @Column({ nullable: true })
  postoperativeSimulation: string;

  @Column({ nullable: true })
  consentForm: string;

  @Column({ default: false })
  isConsentSigned: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Customer, customer => customer.consultations)
  customer: Customer;

  // Using string references to break circular dependency
  @ManyToOne('Staff', 'consultations')
  consultant: any;

  // Using string references to break circular dependency
  @OneToMany('Treatment', 'consultation')
  treatments: any[];
}