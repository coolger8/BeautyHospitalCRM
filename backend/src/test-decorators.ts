import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('test_entities')
export class TestEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;
}