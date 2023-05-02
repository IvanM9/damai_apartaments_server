import { Injectable } from '@nestjs/common';
import { ApartmentRepository } from './apartment.repository';
import { CreateApartmentI } from './aparment.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class ApartmentService {
    constructor(private repository: ApartmentRepository, @InjectEntityManager() private cnx: EntityManager) { }

    async create(payload: CreateApartmentI) {
        return await this.cnx.transaction(async () => {
            try {
                const insert = await this.repository.create(payload);

                if (insert == null) {
                    throw new Error('Error al crear el apartamento')
                }

                return insert;
            } catch (error) {
                throw new Error(error.message);
            }
        })
    };

    async update(id: number, payload: CreateApartmentI) {
        return await this.cnx.transaction(async () => {
            try {
                const update = await this.repository.update(id, payload);

                if (update <= 0) {
                    throw new Error('Error al actualizar el apartamento')
                }

                return update;
            } catch (error) {
                throw new Error(error.message);
            }
        })
    }

    async updateStatus(id: number, status: boolean) {
        return await this.cnx.transaction(async () => {
            try {
                const update = await this.repository.updateStatus(id, status);

                if (update <= 0) {
                    throw new Error(`Error al actualizar el estado del apartamento con id: ${id}`)
                }

                return update;
            } catch (error) {
                throw new Error(error.message);
            }
        })
    }

    async getAll(busy?: boolean, status?: boolean) {
        try {
            const apartments = await this.repository.getAll(busy, status);

            if(apartments == null) {
                throw new Error('Error al obtener los apartamentos')
            }

            return apartments;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getById(id: number) {
        try {
            const apartment = await this.repository.getById(id);

            if(apartment == null) {
                throw new Error(`Error al obtener el apartamento con id: ${id}`)
            }

            return apartment;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateBusy(id: number, busy: boolean) {
        try {
            const update = await this.repository.updateBusy(id, busy);

            if(update <= 0) {
                throw new Error(`Error al actualizar el estado de ocupado del apartamento con id: ${id}`)
            }

            return update;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
