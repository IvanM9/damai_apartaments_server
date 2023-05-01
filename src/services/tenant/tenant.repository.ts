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
  ) {}

  async findAll() {
    return await this.cnx.find(TenantEntity);
  }

  async create(payload: CreateTenantI) {
    const insert = await this.cnx.create(TenantEntity, payload);
    return await this.cnx.save(insert);
  }
}
