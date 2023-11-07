import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { MethodPaymentEntity } from '@models/method-payment.entity';
import { PaginationDto } from '@shared/interfaces/pagination.dto';
import { PaymentsTableI } from '@shared/interfaces/tables.interface';
import { EntityManager } from 'typeorm';

@Injectable()
export class MethodPaymentRepository {
  constructor(@InjectEntityManager() private cnx: EntityManager) {}

  async createMethodPayment(payload: MethodPaymentEntity) {
    const insert = this.cnx.create(MethodPaymentEntity, payload);

    return await this.cnx.save(insert);
  }

  async getById(id: number) {
    return await this.cnx.findOne(MethodPaymentEntity, { where: { id } });
  }

  async getAll(params?: PaginationDto) {
    const query = this.cnx
      .createQueryBuilder()
      .select([
        'methodPayment.id as id',
        'methodPayment.name as name',
        'methodPayment.description as description',
        'methodPayment.isActive as isActive',
        'methodPayment.createdAt as createdAt',
        'methodPayment.updatedAt as updatedAt',
      ])
      .from(MethodPaymentEntity, 'methodPayment')
      .where('methodPayment.isActive = :status', { status: params.status })
      .limit(params.limit)
      .offset((params.page - 1) * params.limit);

    const data = await query.getRawMany();

    return {
      data,
      page: params?.page,
      limit: params?.limit,
      total: await query.getCount(),
      totalPages: Math.ceil((await query.getCount()) / params.limit),
    } as PaymentsTableI;
  }

  async updateStatus(id: number, status: boolean) {
    return await this.cnx.update(
      MethodPaymentEntity,
      { id },
      { isActive: status },
    );
  }

  async update(id: number, payload: MethodPaymentEntity) {
    return await this.cnx.update(MethodPaymentEntity, { id }, payload);
  }
}
