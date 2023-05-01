import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApartmentEntity } from "./apartment.entity";

@Entity({name:"maintenance"})
export class MaintenanceEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name:"description", nullable:true, type:"text"})
    description: string;

    @Column({name:"amount", type:"decimal"})
    amount: string;

    @CreateDateColumn({name:"created_at", update:false})
    createdAt: Date;

    @UpdateDateColumn({name:"updated_at", nullable:true})
    updatedAt: Date;

    @ManyToOne(type => ApartmentEntity, apartment => apartment.maintenances)
    apartment: ApartmentEntity;
}