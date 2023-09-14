import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { LeaseEntity } from './lease.entity';
import { MethodPaymentEntity } from './method-payment.entity';

@Entity({ name: 'payment' })
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'amount', type: 'decimal' })
  amount: number;

  @Column({ name: 'date', type: 'date' })
  date: Date;

  @ManyToOne(() => LeaseEntity, (lease) => lease.payments)
  lease: Relation<LeaseEntity>;

  @ManyToOne(
    () => MethodPaymentEntity,
    (methodPayment) => methodPayment.payments,
  )
  methodPayment: Relation<MethodPaymentEntity>;

  @CreateDateColumn({ name: 'created_at', update: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
