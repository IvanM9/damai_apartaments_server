import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { TenantEntity } from 'src/Models/tenant.entity';
import { EntityManager } from 'typeorm';
import { CreateTenantI } from './tentant.dto';

@Injectable()
export class TenantRepository {
  constructor(
    @InjectEntityManager()
    private readonly cnx: EntityManager,
  ) { }

  async findAll() {
    return await this.cnx.find(TenantEntity);
  }

  async create(payload: CreateTenantI) {
    const insert = await this.cnx.create(TenantEntity, { ...payload, updatedAt: null });
    return await this.cnx.save(insert);
  }

  async update(id: number, payload: CreateTenantI) {
    return (await this.cnx.update(TenantEntity, { id }, payload)).affected;
  }

  async updateStatus(id: number, status: boolean) {
    const isActive = String(status) == "true" ? true : false;

    return (await this.cnx.createQueryBuilder()
      .update(TenantEntity)
      .set({ isActive })
      .where("id = :id", { id })
      .execute()).affected;
  }

  async getById(id: number) {
    return await this.cnx.findOne(TenantEntity, { where: { id }, relations: { leases: true } });
  }
}
