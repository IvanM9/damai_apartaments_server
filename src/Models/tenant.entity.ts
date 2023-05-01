import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LeaseEntity } from './lease.entity';

@Entity({ name: 'tenant' })
export class TenantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'firstname', length: 50 })
  firstname: string;

  @Column({ name: 'lastname', length: 50 })
  lastname: string;

  @Column({ name: 'description', nullable: true, type: 'text' })
  description: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'phone', length: 15, nullable: true })
  phone: string;

  @Column({ name: 'email', length: 50, nullable: true })
  email: string;

  @Column({ name: 'doc_number', length: 15, nullable: true })
  docNumber: string;

  @CreateDateColumn({ name: 'created_at', update: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @OneToMany((type) => LeaseEntity, (lease) => lease.tenant)
  leases: LeaseEntity[];
}
