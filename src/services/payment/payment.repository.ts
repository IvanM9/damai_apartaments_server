import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { PaymentEntity } from "src/Models/payment.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class PaymentRepository{
    constructor(@InjectEntityManager() private cnx: EntityManager){}

    async createPayment(payload: PaymentEntity){
        const insert = this.cnx.create(PaymentEntity, payload)

        return await this.cnx.save(insert);
    }
    async getPaymentByApartment(){}
    async getPaymentByTenant(){}
    async updatePayment(){}
    async deletePayment(){}
}