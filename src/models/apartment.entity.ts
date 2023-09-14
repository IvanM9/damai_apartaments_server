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

  @CreateDateColumn({ name: 'created_at', update: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'busy', default: false, type: 'boolean' })
  busy: boolean;

  @OneToMany(() => LeaseEntity, (lease) => lease.apartment)
  leases: Relation<LeaseEntity[]>;

  @OneToMany(() => MaintenanceEntity, (maintenance) => maintenance.apartment)
  maintenances: Relation<MaintenanceEntity[]>;
}
