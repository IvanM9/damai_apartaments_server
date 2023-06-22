import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PaymentEntity } from 'src/Models/payment.entity';
import { PaginationDto } from 'src/shared/interfaces/pagination.dto';
import { PaymentsTableI } from 'src/shared/interfaces/tables.interface';
import { EntityManager } from 'typeorm';

@Injectable()
export class PaymentRepository {
  constructor(@InjectEntityManager() private cnx: EntityManager) {}

  async createPayment(payload: PaymentEntity) {
    const insert = this.cnx.create(PaymentEntity, payload);

    return await this.cnx.save(insert);
  }

  async getAll() {
    return await this.cnx.find(PaymentEntity, {
      relations: { lease: { apartment: true, tenant: true } },
    });
  }

  async getPaymentByApartment(
    apartmentId: number,
    params: PaginationDto,
    startDate?: Date,
    endDate?: Date,
  ) {
    const query = this.cnx
      .createQueryBuilder()
      .select([
        'payment.id as id',
        'payment.amount as amount',
        'payment.date as date',
        'lease.id as "LeaseId"',
        'tenant.firstname as "tenantFirstname"',
        'tenant.lastname as "tenantLastname"',
        'apartment.name as "apartmentName"',
        'payment.created_at as "createdAt"',
        'payment.updated_at as "updatedAt"',
      ])
      .from(PaymentEntity, 'payment')
      .innerJoin('payment.lease', 'lease')
      .innerJoin('lease.apartment', 'apartment')
      .innerJoin('lease.tenant', 'tenant')
      .where('apartment.id = :apartmentId', { apartmentId })
      .limit(params.limit)
      .offset((params.page - 1) * params.limit)
      .orderBy('payment.date', 'DESC');    

    if (startDate) {
      query.andWhere('payment.date >= :startDate', { startDate });

      if (endDate) {
        query.andWhere('payment.date <= :endDate', { endDate });
      }
    }

    const data = await query.getRawMany();

    return {
      data,
      page: params?.page,
      limit: params?.limit,
      total: await query.getCount(),
      totalPages: Math.ceil((await query.getCount()) / params.limit),
      totalPayments: data.reduce((acc, curr) => acc + curr.amount, 0),
    } as PaymentsTableI;
  }

  async getPaymentByTenant(
    tenantId: number,
    params?: PaginationDto | null,
    startDate?: Date,
    endDate?: Date,
  ) {
    const query = this.cnx
      .createQueryBuilder()
      .select([
        'payment.id as id',
        'payment.amount as amount',
        'payment.date as date',
        'lease.id as "LeaseId"',
        'apartment.name as "apartmentName"',
        'tenant.firstname as "tenantFirstname"',
        'tenant.lastname as "tenantLastname"',
        'payment.created_at as "createdAt"',
        'payment.updated_at as "updatedAt"',
      ])
      .from(PaymentEntity, 'payment')
      .innerJoin('payment.lease', 'lease')
      .innerJoin('lease.tenant', 'tenant')
      .innerJoin('lease.apartment', 'apartment')
      .where('tenant.id = :tenantId', { tenantId })
      .offset((params.page - 1) * params.limit)
      .limit(params.limit)
      .orderBy('payment.date', 'DESC');

    if (startDate) {
      query.andWhere('payment.date >= :startDate', { startDate });

      if (endDate) {
        query.andWhere('payment.date <= :endDate', { endDate });
      }
    }

    const data = await query.getRawMany();

    return {
      data,
      page: params?.page,
      limit: params?.limit,
      total: await query.getCount(),
      totalPages: Math.ceil((await query.getCount()) / params.limit),
      totalPayments: data.reduce((acc, curr) => acc + curr.amount, 0),
    } as PaymentsTableI;
  }

  async updatePayment(id: number, payload: PaymentEntity) {
    return (await this.cnx.update(PaymentEntity, { id }, payload)).affected;
  }

  async getByYearOrMonth(year?: string, month?: number) {
    const query = this.cnx
      .createQueryBuilder()
      .select([
        'payment.id as id',
        'payment.amount as amount',
        'payment.date as date',
        'payment.created_at as "createdAt"',
        'payment.updated_at as "updatedAt"',
        'tenant.firstname as "tenantFirstname"',
        'tenant.lastname as "tenantLastname"',
        'apartment.name as "apartmentName"',
      ])
      .from(PaymentEntity, 'payment')
      .innerJoin('payment.lease', 'lease')
      .innerJoin('lease.tenant', 'tenant')
      .innerJoin('lease.apartment', 'apartment')
      .where('strftime("%Y", payment.date) = :year', {
        year: year ?? new Date().getFullYear().toString(),
      })
      .orderBy('payment.date', 'DESC');

    if (month)
      query.andWhere('strftime("%m", payment.date) = :month', { month });

    return await query.getRawMany();
  }

  async getPaymentByLease(
    leaseId: number,
    params?: PaginationDto | null,
    startDate?: Date,
    endDate?: Date,
  ) {
    const query = this.cnx
      .createQueryBuilder()
      .select([
        'payment.id as id',
        'payment.amount as amount',
        'payment.date as date',
        'lease.id as "LeaseId"',
        'payment.created_at as "createdAt"',
        'payment.updated_at as "updatedAt"',
      ])
      .from(PaymentEntity, 'payment')
      .innerJoin('payment.lease', 'lease')
      .where('lease.id = :leaseId', { leaseId })
      .offset((params.page - 1) * params.limit)
      .limit(params.limit);

    if (startDate) {
      query.andWhere('payment.date >= :startDate', { startDate });

      if (endDate) {
        query.andWhere('payment.date <= :endDate', { endDate });
      }
    }

    const data = await query.getRawMany();
    return {
      data,
      page: params?.page,
      limit: params?.limit,
      total: await query.getCount(),
      totalPages: Math.ceil((await query.getCount()) / params.limit),
      totalPayments: data.reduce((acc, curr) => acc + curr.amount, 0),
    } as PaymentsTableI;
  }

  async getValuesGeneral() {
    const year = await this.cnx
      .createQueryBuilder()
      .select(['payment.amount as amount'])
      .from(PaymentEntity, 'payment')
      .where('strftime("%Y", payment.date) = :year', {
        year: new Date().getFullYear().toString(),
      })
      .getRawMany<PaymentEntity>();

    const month = await this.cnx
      .createQueryBuilder()
      .select(['payment.amount as amount'])
      .from(PaymentEntity, 'payment')
      .where('strftime("%m", payment.date) = :month', {
        month: new Date().getMonth().toString(),
      })
      .getRawMany<PaymentEntity>();

    return {
      year: year.reduce((acc, curr) => acc + curr.amount, 0),
      month: month.reduce((acc, curr) => acc + curr.amount, 0),
    };
  }
}
