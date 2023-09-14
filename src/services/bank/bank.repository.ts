import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BankEntity } from '@models/bank.entity';
import { EntityManager } from 'typeorm';
import { PaginationDto } from '@shared/interfaces/pagination.dto';
import { TableI } from '@shared/interfaces/tables.interface';

@Injectable()
export class BankRepository {
  constructor(@InjectEntityManager() private cnx: EntityManager) {}

  async createBank(payload: BankEntity) {
    const insert = this.cnx.create(BankEntity, payload);

    return await this.cnx.save(insert);
  }

  async getById(id: number) {
    return await this.cnx.findOne(BankEntity, { where: { id } });
  }

  async getAll(filters: PaginationDto) {
    const query = this.cnx
      .createQueryBuilder()
      .select([
        'bank.id as id',
        'bank.name as name',
        'bank.description as description',
        'bank.created_at as "createdAt"',
        'bank.updated_at as "updatedAt"',
      ])
      .from(BankEntity, 'bank')
      .where('bank.isActive = :isActive', { isActive: filters.status })
      .limit(filters.limit)
      .offset((filters.page - 1) * filters.limit);

    const data = await query.getRawMany();
    return {
      data,
      page: filters?.page,
      limit: filters?.limit,
      total: await query.getCount(),
      status: filters.status,
      totalPages: Math.ceil((await query.getCount()) / filters.limit),
    } as TableI;
  }

  async updateBank(id: number, payload: BankEntity) {
    return await this.cnx.update(BankEntity, id, payload);
  }

  async updateStatus(id: number, status: boolean) {
    return await this.cnx.update(BankEntity, id, { isActive: status });
  }
}
