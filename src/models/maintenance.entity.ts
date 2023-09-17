import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { ApartmentEntity } from './apartment.entity';

@Entity({ name: 'maintenance' })
export class MaintenanceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'description', nullable: true, type: 'text' })
  description: string;

  @Column({ name: 'amount', type: 'decimal' })
  amount: string;

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

  @ManyToOne(() => ApartmentEntity, (apartment) => apartment.maintenances)
  @JoinColumn({ name: 'apartment_id' })
  apartment: Relation<ApartmentEntity>;
}
