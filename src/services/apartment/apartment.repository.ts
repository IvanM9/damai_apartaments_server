import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ApartmentEntity } from '@models/apartment.entity';
import { EntityManager } from 'typeorm';
import { CreateApartmentI } from './aparment.dto';

@Injectable()
export class ApartmentRepository {
  constructor(@InjectEntityManager() private cnx: EntityManager) {}

  async create(payload: CreateApartmentI) {
    const insert = this.cnx.create(ApartmentEntity, {
      ...payload,
      updatedAt: null,
    });
    return await this.cnx.save(insert);
  }

  async update(id: number, payload: CreateApartmentI) {
    return (await this.cnx.update(ApartmentEntity, { id }, payload)).affected;
  }

  async updateStatus(id: number, status: boolean) {
    return (await this.cnx.update(ApartmentEntity, { id }, { status }))
      .affected;
  }

  async updateBusy(id: number, busy: boolean) {
    return (
      await this.cnx.update(
        ApartmentEntity,
        { id },
        { busy: String(busy) === 'true' ? true : false },
      )
    ).affected;
  }

  async getAll(busy?: boolean, status?: boolean) {
    if (busy) busy = String(busy) == 'true' ? true : false;

    if (status == undefined || status == null) status = true;

    return await this.cnx.find(ApartmentEntity, {
      where: {
        busy,
        status: String(status) == 'true' ? true : false,
      },
      order: { busy: 'ASC' },
    });
  }

  async getById(id: number) {
    return await this.cnx.findOne(ApartmentEntity, {
      where: { id },
      relations: { leases: { tenant: true } },
      select: {
        id: true,
        name: true,
        numberOfRooms: true,
        monthlyRent: true,
        status: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        busy: true,
        leases: {
          id: true,
          tenant: { firstName: true, lastName: true },
          startDate: true,
          endDate: true,
        },
      },
      order: { leases: { startDate: 'DESC' } },
    });
  }

  async getByName(name: string) {
    return await this.cnx.findOne(ApartmentEntity, { where: { name } });
  }
}
