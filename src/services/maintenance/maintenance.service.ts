import { HttpException, Injectable } from '@nestjs/common';
import { MaintenanceRepository } from './maintenance.repository';
import { PaginationDto } from '../../shared/interfaces/pagination.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { MaintenanceEntity } from '../../Models/maintenance.entity';
import { ApartmentService } from '../apartment/apartment.service';
import { CreateMaintenanceDto, UpdateMaintenanceDto } from './maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(
    private maintenanceRepository: MaintenanceRepository,
    @InjectEntityManager() private cnx: EntityManager,
    private apartmentService: ApartmentService,
  ) {}

  async getAll(params: PaginationDto) {
    try {
      const data = await this.maintenanceRepository.getAll(params);

      if (!data) throw new HttpException('No se encontraron datos', 404);

      return data;
    } catch (e) {
      throw e;
    }
  }

  async create(data: CreateMaintenanceDto) {
    return await this.cnx.transaction(async (manager) => {
      try {
        const apartment = await this.apartmentService.getById(data.apartmentId);

        const payload = {
          amount: data.amount,
          description: data.description,
          apartment,
        } as MaintenanceEntity;

        const created = await this.maintenanceRepository.create(payload);

        if (!created)
          throw new HttpException('No se pudo crear el mantenimiento', 500);

        return created;
      } catch (e) {
        throw e;
      }
    });
  }

  async getById(id: number) {
    try {
      const data = await this.maintenanceRepository.getById(id);

      if (!data) throw new HttpException('No se encontraron datos', 404);

      return data;
    } catch (e) {
      throw e;
    }
  }

  async update(id: number, data: UpdateMaintenanceDto) {
    try {
      const payload = {
        amount: data.amount,
        description: data.description,
      } as MaintenanceEntity;

      const updated = await this.maintenanceRepository.update(id, payload);

      if (updated.affected === 0)
        throw new HttpException('No se pudo actualizar el mantenimiento', 500);

      return updated;
    } catch (e) {
      throw e;
    }
  }

  async delete(id: number) {
    try {
      const deleted = await this.maintenanceRepository.delete(id);

      if (deleted.affected === 0)
        throw new HttpException('No se pudo eliminar el mantenimiento', 500);

      return deleted;
    } catch (e) {
      throw e;
    }
  }
}
