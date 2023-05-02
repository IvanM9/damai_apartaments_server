import { Injectable } from '@nestjs/common';
import { LeaseRepository } from './lease.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ApartmentService } from '../apartment/apartment.service';
import { CreateLeaseDto } from './lease.dto';
import { TenantService } from '../tenant/tenant.service';
import { LeaseEntity } from 'src/Models/lease.entity';

@Injectable()
export class LeaseService {
    constructor(
        private repository: LeaseRepository,
        @InjectEntityManager() private cnx: EntityManager,
        private apartmentService: ApartmentService,
        private tenantService: TenantService,
    ) { }

    async createLease(payload: CreateLeaseDto) {
        return await this.cnx.transaction(async () => {
            try {
                const apartment =  await this.apartmentService.getById(payload.apartmentId);

                const tenant = await this.tenantService.getById(payload.tenantId);

                const data = {
                    startDate: payload.startDate,
                    endDate: payload.endDate,
                    apartment,
                    tenant,
                    description: payload.description,
                    monthlyRent: payload.monthlyRent,
                } as LeaseEntity;

                const insert = await this.repository.createLease(data);

                if(!insert)
                    throw new Error("Error en crear contrato");

                await this.apartmentService.updateBusy(payload.apartmentId, true);

                return insert

            } catch (error) {
                throw new Error(error.message);
            }
        });
    }

    async getAll() {
        try {
            const data = await this.repository.getAll();

            if(!data)
                throw new Error("Error en obtener contratos");
            
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
