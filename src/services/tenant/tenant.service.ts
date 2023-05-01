import { Injectable } from '@nestjs/common';
import { TenantRepository } from './tenant.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateTenantI } from './tentant.dto';

@Injectable()
export class TenantService {
  constructor(
    private readonly repository: TenantRepository,
    @InjectEntityManager() private cnx: EntityManager,
  ) { }

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

        if (insert === null)
          throw new Error(`No se pudo insertar a ${payload.firstname}`);

        return insert;
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }

  async update(id: number, payload: CreateTenantI) {
    try {
      const updated = await this.repository.update(id, payload);

      if (updated === 0)
        throw new Error(`No se pudo actualizar a ${payload.firstname}`);

      return updated;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateStatus(id: number, status: boolean) {
    try {
      const updated = await this.repository.updateStatus(id, status);

      if (updated === 0)
        throw new Error(`No se pudo actualizar el estado de ${id}`);

      return updated;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getById(id: number) {
    try {
      const tenant = await this.repository.getById(id);

      if (tenant == null)
        throw new Error(`No se encontro el inquilino con id ${id}`);

      return tenant;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
