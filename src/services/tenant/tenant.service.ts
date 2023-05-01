import { HttpException, Injectable } from '@nestjs/common';
import { TenantRepository } from './tenant.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateTenantI } from './tentant.dto';

@Injectable()
export class TenantService {
  constructor(
    private readonly repository: TenantRepository,
    @InjectEntityManager() private cnx: EntityManager,
  ) {}

  async findAll() {
    try {
      return await this.repository.findAll();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async create(payload: CreateTenantI) {
    return await this.cnx.transaction(async (cnxTran) => {
      try {
        const insert = await this.repository.create(payload);

        if (insert == null)
          throw new Error(`No se pudo insertar a ${payload.firstname}`);

        return insert;
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }
}
