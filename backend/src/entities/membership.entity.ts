import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type MembershipLevel = 'normal' | 'silver' | 'gold' | 'platinum';

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @Column({
    type: 'text',
    default: 'normal'
  })
  level: MembershipLevel;

  @Column({ default: 0 })
  points: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}