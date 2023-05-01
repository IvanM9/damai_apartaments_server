/* eslint-disable */
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LeaseEntity } from './lease.entity';
import { MaintenanceEntity } from './maintenance.entity';

@Entity({ name: 'apartment' })
export class ApartmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', length: 50, unique: true })
  name: string;

  @Column({ name: 'number_of_rooms', type: 'integer' })
  numberOfRooms: number;

  @Column({ name: 'monthly_rent', type: 'decimal' })
  monthlyRent: string;

  @Column({ name: 'status', type: 'boolean', default: true })
  status: boolean;

  @Column({ name: 'description', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'date_at', update: false })
  dateAt: Date;

  @UpdateDateColumn({ name: 'update_at', nullable: true })
  updateAt: Date;

  @OneToMany(() => LeaseEntity, (lease) => lease.apartment)
  leases: LeaseEntity[];

  @OneToMany(
    (type) => MaintenanceEntity,
    (maintenance) => maintenance.apartment
  )
  maintenances: MaintenanceEntity[];
}
