import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { LeaseEntity } from '@models/lease.entity';
import { Brackets, EntityManager } from 'typeorm';

@Injectable()
export class LeaseRepository {
  constructor(@InjectEntityManager() private cnx: EntityManager) {}

  async createLease(payload: LeaseEntity) {
    const insert = await this.cnx.create(LeaseEntity, payload);
    return await this.cnx.save(insert);
  }

  async getAll() {
    return await this.cnx
      .createQueryBuilder()
      .select([
        'lease.id as id',
        'lease.start_date as "startDate"',
        'lease.end_date as "endDate"',
        'lease.status as status',
        'apartment.id as "apartmentId"',
        'tenant.id as "tenantId"',
        'lease.monthly_rent as "monthlyRent"',
        'lease.description as "description"',
        'lease.created_at as "createdAt"',
        'lease.updated_at as "updatedAt"',
      ])
      .from(LeaseEntity, 'lease')
      .innerJoin('lease.apartment', 'apartment')
      .innerJoin('lease.tenant', 'tenant')
      .orderBy('lease.id', 'DESC')
      .getRawMany();
  }

  async getById(id: number) {
    return await this.cnx.findOne(LeaseEntity, {
      where: { id },
      relations: { apartment: true, tenant: true },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
        monthlyRent: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        apartment: {
          id: true,
          name: true,
        },
        tenant: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    });
  }

  async getByApartmentIdAndTenantId(apartmentId: number, tenantId: number) {
    return await this.cnx.count(LeaseEntity, {
      where: {
        apartment: { id: apartmentId },
        tenant: { id: tenantId },
        status: true,
      },
    });
  }

  async updateStatus(id: number, status: boolean) {
    status = String(status) == 'true' ? true : false;

    return await this.cnx.update(LeaseEntity, { id }, { status });
  }

  async update(payload: LeaseEntity, id: number) {
    return await this.cnx.update(LeaseEntity, { id }, payload);
  }

  async getToBeExpired() {
    const otherDate = new Date();
    otherDate.setDate(new Date().getDate() + 5);

    const query = this.cnx
      .createQueryBuilder()
      .select([
        'lease.id as id',
        'lease.start_date as "startDate"',
        'lease.end_date as "endDate"',
        'apartment.id as "apartmentId"',
        'apartment.name as "apartmentName"',
      ])
      .from(LeaseEntity, 'lease')
      .innerJoin('lease.apartment', 'apartment')
      .where(
        new Brackets((qb) => {
          qb.where('lease.endDate >= :date', { date: new Date() }).andWhere(
            'lease.endDate <= :otherDate',
            { otherDate: otherDate.toDateString() },
          );
        }),
      )
      .andWhere('lease.status = :status', { status: true });

    return await query.getRawMany();
  }
}
