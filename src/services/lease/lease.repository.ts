import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { LeaseEntity } from "src/Models/lease.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class LeaseRepository {
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
        return await this.cnx.findOne(LeaseEntity, {
            where: { id },
            relations: { apartment: true, tenant: true }
        })
    }

    async getByApartmentIdAndTenantId(apartmentId: number, tenantId: number) {
        return await this.cnx.count(LeaseEntity, {
            where: { apartment: { id: apartmentId }, tenant: { id: tenantId }, status: true },
        })
    }

    async updateStatus(id: number, status: boolean) {
        status = String(status) == "true" ? true : false;

        return await this.cnx.update(LeaseEntity, { id }, { status });
    }

    async update(payload: LeaseEntity, id: number) {
        return await this.cnx.update(LeaseEntity, { id }, payload);
    }
}