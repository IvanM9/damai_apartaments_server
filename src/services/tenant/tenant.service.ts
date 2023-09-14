import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      const tenants = await this.repository.findAll();

      if (!tenants)
        throw new HttpException(
          'No se encontraron inquilinos',
          HttpStatus.NOT_FOUND,
        );

      return tenants;
    } catch (error) {
      throw error;
    }
  }

  async create(payload: CreateTenantI) {
    return await this.cnx.transaction(async () => {
      try {
        const insert = await this.repository.create(payload);

        if (insert === null)
          throw new HttpException(
            'No se pudo crear el inquilino',
            HttpStatus.BAD_REQUEST,
          );

        return insert;
      } catch (error) {
        throw error;
      }
    });
  }

  async update(id: number, payload: CreateTenantI) {
    try {
      const updated = await this.repository.update(id, payload);

      if (updated === 0)
        throw new HttpException(
          `No se pudo actualizar el inquilino con id ${id}`,
          HttpStatus.NOT_MODIFIED,
        );

      return updated;
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(id: number, status: boolean) {
    try {
      const updated = await this.repository.updateStatus(id, status);

      if (updated === 0)
        throw new HttpException(
          `No se pudo actualizar el estado del inquilino con id ${id}`,
          HttpStatus.NOT_MODIFIED,
        );

      return updated;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number) {
    try {
      const tenant = await this.repository.getById(id);

      if (tenant == null)
        throw new HttpException(
          `No se encontró el inquilino con id ${id}`,
          HttpStatus.NOT_FOUND,
        );

      return tenant;
    } catch (error) {
      throw error;
    }
  }
}
