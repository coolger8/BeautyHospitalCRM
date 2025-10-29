import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ type: 'text' })
  targetCustomerCriteria: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountPercentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fixedDiscount: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}