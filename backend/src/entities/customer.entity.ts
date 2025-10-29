import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
// Note: We're using string-based imports to resolve circular dependencies

export type CustomerSource = 'meituan' | 'referral' | 'advertisement' | 'other';
export type CustomerValueLevel = 'platinum' | 'gold' | 'silver' | 'bronze';
export type ConsumptionLevel = 'high' | 'medium' | 'low';
export type DemandType = 'skin_management' | 'plastic_surgery' | 'anti_aging' | 'other';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  age: number;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: 'text',
    default: 'other'
  })
  source: CustomerSource;

  @Column({
    type: 'text',
    default: 'bronze'
  })
  valueLevel: CustomerValueLevel;

  @Column({
    type: 'text',
    default: 'medium'
  })
  consumptionLevel: ConsumptionLevel;

  @Column({
    type: 'text',
    default: 'other'
  })
  demandType: DemandType;

  @Column({ nullable: true })
  allergyHistory: string;

  @Column({ nullable: true })
  contraindications: string;

  @Column({ nullable: true })
  consumptionPreference: string;

  @Column({ default: 0 })
  visitFrequency: number;

  @Column({ default: 0 })
  satisfactionScore: number;

  @Column({ nullable: true })
  relatedCustomerId: number;

  @Column({ default: false })
  isEncrypted: boolean;

  @Column({ nullable: true })
  membershipId: number;

  // Using string-based reference to resolve circular dependency
  @ManyToOne('Membership', 'customers')
  membership: any; // Using 'any' type to avoid circular dependency issues

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Using string-based references to resolve circular dependencies
  @OneToMany('Consultation', 'customer')
  consultations: any[];

  @OneToMany('Appointment', 'customer')
  appointments: any[];

  @OneToMany('Treatment', 'customer')
  treatments: any[];
}