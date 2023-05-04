import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { PaymentEntity } from "src/Models/payment.entity";
import { PaginationDto } from "src/shared/interfaces/pagination.dto";
import { TableI } from "src/shared/interfaces/tables.interface";
import { EntityManager } from "typeorm";

@Injectable()
export class PaymentRepository {
    constructor(@InjectEntityManager() private cnx: EntityManager) { }

    async createPayment(payload: PaymentEntity) {
        const insert = this.cnx.create(PaymentEntity, payload)

        return await this.cnx.save(insert);
    }

    async getAll() {
        return await this.cnx.find(PaymentEntity);
    }

    async getPaymentByApartment(
        apartmentId: number,
        params?: PaginationDto | null,
        startDate?: Date,
        endDate?: Date
    ) {
        const query = this.cnx.createQueryBuilder()
            .select([
                'payment.id as id',
                'payment.amount as amount',
                'payment.date as date',
                'lease.id as "LeaseId"',
                'payment.created_at as "createdAt"',
                'payment.updated_at as "updatedAt"',
            ])
            .from(PaymentEntity, "payment")
            .innerJoin('payment.lease', 'lease')
            .innerJoin('lease.apartment', 'apartment')
            .where("apartment.id = :apartmentId", { apartmentId })
            .limit(params.limit)
            .offset((params.page - 1) * params.limit);

        if (startDate) {
            query.andWhere(
                "payment.date >= :startDate",
                { startDate }
            );

            if (endDate) {
                query.andWhere(
                    "payment.date <= :endDate",
                    { endDate }
                );
            }
        }

        return {
            data: await query.getRawMany(),
            page: params?.page,
            limit: params?.limit,
            total: await query.getCount(),
        } as TableI;
    }

    async getPaymentByTenant(
        tenantId: number,
        params?: PaginationDto | null,
        startDate?: Date,
        endDate?: Date
    ) {
        const query = this.cnx.createQueryBuilder()
            .select([
                'payment.id as id',
                'payment.amount as amount',
                'payment.date as date',
                'lease.id as "LeaseId"',
                'payment.created_at as "createdAt"',
                'payment.updated_at as "updatedAt"',
            ])
            .from(PaymentEntity, "payment")
            .innerJoin('payment.lease', 'lease')
            .innerJoin('lease.tenant', 'tenant')
            .where("tenant.id = :tenantId", { tenantId })
            .offset((params.page - 1) * params.limit)
            .limit(params.limit);

        if (startDate) {
            query.andWhere(
                "payment.date >= :startDate",
                { startDate }
            );

            if (endDate) {
                query.andWhere(
                    "payment.date <= :endDate",
                    { endDate }
                );
            }
        }

        return {
            data: await query.getRawMany(),
            page: params?.page,
            limit: params?.limit,
            total: await query.getCount(),
        } as TableI;;
    }

    async updatePayment() { }
    async deletePayment() { }
}