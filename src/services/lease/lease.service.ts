import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LeaseRepository } from './lease.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ApartmentService } from '../apartment/apartment.service';
import { CreateLeaseDto, UpdateLeaseDto } from './lease.dto';
import { TenantService } from '../tenant/tenant.service';
import { LeaseEntity } from '@models/lease.entity';
import { updateFailed, updateSuccessful } from '@shared/constants/messages';

@Injectable()
export class LeaseService {
  constructor(
    private repository: LeaseRepository,
    @InjectEntityManager() private cnx: EntityManager,
    private apartmentService: ApartmentService,
    private tenantService: TenantService,
  ) {}

  async createLease(payload: CreateLeaseDto) {
    return await this.cnx.transaction(async () => {
      try {
        const apartment = await this.apartmentService.getById(
          payload.apartmentId,
        );

        const tenant = await this.tenantService.getById(payload.tenantId);

        const exist = await this.repository.getByApartmentIdAndTenantId(
          payload.apartmentId,
          payload.tenantId,
        );

        if (exist > 0)
          throw new HttpException(
            'El inquilino ya tiene un contrato con este apartamento',
            HttpStatus.BAD_REQUEST,
          );

        const data = {
          startDate: payload.startDate,
          endDate: payload.endDate,
          apartment,
          tenant,
          description: payload.description,
          monthlyRent: payload.monthlyRent,
        } as LeaseEntity;

        const insert = await this.repository.createLease(data);

        if (!insert)
          throw new HttpException(
            'Error en crear contrato',
            HttpStatus.BAD_REQUEST,
          );

        await this.apartmentService.updateBusy(payload.apartmentId, true);

        return insert;
      } catch (error) {
        throw error;
      }
    });
  }

  async getAll() {
    try {
      const data = await this.repository.getAll();

      if (!data)
        throw new HttpException(
          'Error en obtener contratos',
          HttpStatus.BAD_REQUEST,
        );

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number) {
    try {
      const data = await this.repository.getById(id);

      if (!data)
        throw new HttpException(
          'Error en obtener contrato',
          HttpStatus.BAD_REQUEST,
        );

      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(id: number, status: boolean) {
    return await this.cnx.transaction(async () => {
      try {
        const lease = await this.getById(id);

        const updated = await this.repository.updateStatus(id, status);

        if (updated.affected == 0)
          throw new HttpException(
            updateFailed(`contrato con id ${id}`),
            HttpStatus.BAD_REQUEST,
          );

        await this.apartmentService.updateBusy(lease.apartment.id, status);

        return updateSuccessful(`contrato con id ${id}`);
      } catch (error) {
        throw error;
      }
    });
  }

  async update(id: number, payload: UpdateLeaseDto) {
    try {
      const data = {
        startDate: payload.startDate,
        endDate: payload.endDate,
        description: payload.description,
        monthlyRent: payload.monthlyRent,
      } as LeaseEntity;

      const updated = await this.repository.update(data, id);

      if (updated.affected == 0)
        throw new HttpException(
          updateFailed(`contrato con id ${id}`),
          HttpStatus.BAD_REQUEST,
        );

      return updateSuccessful(`contrato con id ${id}`);
    } catch (error) {
      throw error;
    }
  }

  async getToBeExpired() {
    try {
      const data = await this.repository.getToBeExpired();

      if (data == null)
        throw new HttpException(
          'Error en obtener contratos',
          HttpStatus.BAD_REQUEST,
        );

      return data;
    } catch (error) {
      throw error;
    }
  }
}
