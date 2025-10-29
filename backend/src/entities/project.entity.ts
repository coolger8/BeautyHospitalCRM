import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type ProjectCategory = 'skin_care' | 'injectables' | 'surgery' | 'laser' | 'other';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'text',
    default: 'other'
  })
  category: ProjectCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}