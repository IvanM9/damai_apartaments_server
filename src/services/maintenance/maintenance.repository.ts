import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { PaginationDto } from '@shared/interfaces/pagination.dto';
import { MaintenanceEntity } from '@models/maintenance.entity';
import { TableI } from '@shared/interfaces/tables.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MaintenanceRepository {
  constructor(@InjectEntityManager() private cnx: EntityManager) {}

  async getAll(params: PaginationDto) {
    const query = this.cnx
      .createQueryBuilder()
      .select([
        'maintenance.id as id',
        'maintenance.description as description',
        'maintenance.amount as amount',
        'apartment.id as apartmentId',
        'maintenance.updated_at as "updatedAt"',
        'maintenance.created_at as "createdAt"',
      ])
      .from(MaintenanceEntity, 'maintenance')
      .innerJoin('maintenance.apartment', 'apartment');

    const data = await query.getRawMany();

    return {
      data,
      page: params.page,
      limit: params.limit,
      total: await query.getCount(),
      totalPages: Math.ceil((await query.getCount()) / params.limit),
    } as TableI;
  }

  async create(data: MaintenanceEntity) {
    const obj = this.cnx.create(MaintenanceEntity, data);
    return await this.cnx.save(obj);
  }

  async getById(id: number) {
    return await this.cnx.findOne(MaintenanceEntity, {
      where: { id },
      relations: { apartment: true },
      select: {
        id: true,
        description: true,
        amount: true,
        createdAt: true,
        updatedAt: true,
        apartment: {
          id: true,
          name: true,
        },
      },
    });
  }

  async update(id: number, data: MaintenanceEntity) {
    return await this.cnx.update(MaintenanceEntity, id, data);
  }

  async delete(id: number) {
    return await this.cnx.delete(MaintenanceEntity, { id });
  }
}
