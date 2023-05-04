import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { LeaseEntity } from "src/Models/lease.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class LeaseRepository{
    constructor(@InjectEntityManager() private cnx: EntityManager) { }

    async createLease(payload: LeaseEntity) {
        const insert = await this.cnx.create(LeaseEntity, payload);
        return await this.cnx.save(insert);
    }

    async getAll() {
        return await this.cnx.createQueryBuilder()
        .select()
        .from(LeaseEntity, "lease")
        .orderBy("lease.id", "DESC")
        .getRawMany();
    }

    async getById(id: number) {
        return await this.cnx.findOne(LeaseEntity, { where: { id }})
    }
}