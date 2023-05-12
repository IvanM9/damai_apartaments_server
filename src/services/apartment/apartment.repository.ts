import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ApartmentEntity } from 'src/Models/apartment.entity';
import { EntityManager } from 'typeorm';
import { CreateApartmentI } from './aparment.dto';

@Injectable()
export class ApartmentRepository {
    constructor(@InjectEntityManager() private cnx: EntityManager) { }

    async create(payload: CreateApartmentI) {
        const insert = await this.cnx.create(ApartmentEntity, { ...payload, updateAt: null })
        return await this.cnx.save(insert);
    }

    async update(id: number, payload: CreateApartmentI) {
        return (await this.cnx.update(ApartmentEntity, { id }, payload)).affected;
    }

    async updateStatus(id: number, status: boolean) {
        return (await this.cnx.update(ApartmentEntity,
            { id },
            { status: String(status) === 'true' ? true : false }
        )).affected;
    }

    async updateBusy(id: number, busy: boolean) {
        return (await this.cnx.update(ApartmentEntity,
            { id },
            { busy: String(busy) === 'true' ? true : false }
        )).affected;
    }

    async getAll(busy?: boolean, status?: boolean) {
        if (busy == undefined || busy == null)
            busy = false;

        if (status == undefined || status == null)
            status = true;

        return await this.cnx.createQueryBuilder()
            .select()
            .from(ApartmentEntity, 'apartment')
            .where('apartment.busy = :busy',
                { busy: String(busy) == "true" ? true : false })
            .andWhere('apartment.status = :status',
                { status: String(status) == "true" ? true : false })
            .getRawMany();
    }

    async getById(id: number) {
        return await this.cnx.findOne(ApartmentEntity, {
            where: { id },
            relations: { leases: true }
        })
    }
}
