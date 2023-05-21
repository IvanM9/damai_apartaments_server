import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { BankEntity } from './bank.entity';

@Entity({ name: 'method_payment' })
export class MethodPaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', length: 50 })
  name: string;

  @Column({ name: 'description', nullable: true, type: 'text' })
  description: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', update: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @OneToMany((type) => PaymentEntity, (payment) => payment.methodPayment)
  payments: PaymentEntity[];

  @ManyToOne((type) => BankEntity, (bank) => bank.methodPayments)
  bank: BankEntity;
}
