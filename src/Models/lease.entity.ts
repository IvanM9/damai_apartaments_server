import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApartmentEntity } from "./apartment.entity";
import { TenantEntity } from "./tenant.entity";
import { PaymentEntity } from "./payment.entity";

@Entity({name:"lease"})
export class LeaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name:"start_date", type:"date"})
    startDate: Date;

    @Column({name:"end_date", type:"date"})
    endDate: Date;

    @Column({name:"monthly_rent", type:"decimal"})
    monthlyRent: string;

    @Column({name:"status", type:"boolean", default:true})
    status: boolean;

    @Column({name:"description", nullable:true, type:"text"})
    description: string;

    @CreateDateColumn({name:"created_at", update:false})
    createdAt: Date;

    @UpdateDateColumn({name:"updated_at", nullable:true})
    updatedAt: Date;

    @ManyToOne(type => ApartmentEntity, apartment => apartment.leases)
    apartment: ApartmentEntity;

    @ManyToOne(type => TenantEntity, tenant => tenant.leases)
    tenant: TenantEntity;

    @OneToMany(type => PaymentEntity, payment => payment.lease)
    payments: PaymentEntity[];
}