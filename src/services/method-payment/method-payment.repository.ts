import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { MethodPaymentEntity } from "src/Models/method-payment.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class MethodPaymentRepository {
    constructor(@InjectEntityManager() private cnx: EntityManager) { }

    async createMethodPayment(payload: MethodPaymentEntity) {
        const insert = this.cnx.create(MethodPaymentEntity, payload);

        return await this.cnx.save(insert);
    }

    async getById(id: number) {
        return await this.cnx.findOne(MethodPaymentEntity, { where: { id } });
    }
}