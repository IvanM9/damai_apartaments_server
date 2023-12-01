import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { LeaseEntity } from './lease.entity';

@Entity({ name: 'tenant' })
export class TenantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', length: 50 })
  firstName: string;

  @Column({ name: 'last_name', length: 50, nullable: true })
  lastName: string;

  @Column({ name: 'description', nullable: true, type: 'text' })
  description: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'phone', length: 15, nullable: true })
  phone: string;

  @Column({ name: 'email', length: 50, nullable: true })
  email: string;

  @Column({ name: 'doc_number', length: 15, nullable: true, unique: true })
  identification: string;

  @CreateDateColumn({
    name: 'created_at',
    update: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt: Date;

  @OneToMany(() => LeaseEntity, (lease) => lease.tenant)
  leases: Relation<LeaseEntity[]>;
}
