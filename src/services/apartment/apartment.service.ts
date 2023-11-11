import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ApartmentRepository } from './apartment.repository';
import { CreateApartmentI } from './aparment.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class ApartmentService {
  constructor(
    private repository: ApartmentRepository,
    @InjectEntityManager() private cnx: EntityManager,
  ) {}

  async create(payload: CreateApartmentI) {
    return await this.cnx.transaction(async () => {
      try {
        const exist = await this.repository.getByName(payload.name);

        if (exist)
          throw new HttpException(
            'Ya existe un apartamento con ese nombre',
            HttpStatus.BAD_REQUEST,
          );

        const insert = await this.repository.create(payload);

        if (!insert) {
          throw new HttpException(
            'Error al crear el apartamento',
            HttpStatus.BAD_REQUEST,
          );
        }

        return insert;
      } catch (error) {
        throw error;
      }
    });
  }

  async update(id: number, payload: CreateApartmentI) {
    return await this.cnx.transaction(async () => {
      try {
        const update = await this.repository.update(id, payload);

        if (update <= 0) {
          throw new HttpException(
            'Error al actualizar el apartamento',
            HttpStatus.NOT_MODIFIED,
          );
        }

        return update;
      } catch (error) {
        throw error;
      }
    });
  }

  async updateStatus(id: number, status: boolean) {
    return await this.cnx.transaction(async () => {
      try {
        const update = await this.repository.updateStatus(id, status);

        if (update <= 0) {
          throw new HttpException(
            `Error al actualizar el estado del apartamento con id: ${id}`,
            HttpStatus.NOT_MODIFIED,
          );
        }

        return update;
      } catch (error) {
        throw error;
      }
    });
  }

  async getAll(busy?: boolean, status?: boolean) {
    try {
      const apartments = await this.repository.getAll(busy, status);

      if (apartments == null) {
        throw new HttpException(
          'Error al obtener los apartamentos',
          HttpStatus.NOT_FOUND,
        );
      }

      return apartments;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number) {
    try {
      const apartment = await this.repository.getById(id);

      if (apartment == null) {
        throw new HttpException(
          `Error al obtener el apartamento con id: ${id}`,
          HttpStatus.NOT_FOUND,
        );
      }

      return apartment;
    } catch (error) {
      throw error;
    }
  }

  async updateBusy(id: number, busy: boolean) {
    try {
      const update = await this.repository.updateBusy(id, busy);

      if (update <= 0) {
        throw new HttpException(
          `Error al actualizar el estado de ocupado del apartamento con id: ${id}`,
          HttpStatus.NOT_MODIFIED,
        );
      }

      return update;
    } catch (error) {
      throw error;
    }
  }
}
