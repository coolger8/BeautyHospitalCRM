import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Customer } from './customer.entity';
import { Project } from './project.entity';
import { Staff } from './staff.entity';

export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',
  PAID = 'paid',
  COMPLETED = 'completed',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  WECHAT = 'wechat',
  ALIPAY = 'alipay',
  CARD = 'card',
  CASH = 'cash'
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @Column()
  projectId: number;

  @Column()
  consultantId: number;

  @Column({
    type: 'text',
    default: 'pending_payment'
  })
  status: OrderStatus;

  @Column({
    type: 'text',
    default: 'wechat'
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  finalAmount: number;

  @Column({ nullable: true })
  discountApproverId: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Customer)
  customer: Customer;

  @ManyToOne(() => Project)
  project: Project;

  @ManyToOne(() => Staff)
  consultant: Staff;

  @ManyToOne(() => Staff)
  discountApprover: Staff;
}