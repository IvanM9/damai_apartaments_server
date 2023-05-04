import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { CreatePaymentDto } from './payment.dto';
import { PaymentEntity } from 'src/Models/payment.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { MethodPaymentService } from '../method-payment/method-payment.service';
import { LeaseService } from '../lease/lease.service';
import { PaginationDto } from 'src/shared/interfaces/pagination.dto';
import { ApartmentService } from '../apartment/apartment.service';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class PaymentService {
    constructor(
        private repo: PaymentRepository,
        @InjectEntityManager() private cnx: EntityManager,
        private serviceMethodPayment: MethodPaymentService,
        private serviceLease: LeaseService,
        private serviceApartment: ApartmentService,
        private serviceTenant: TenantService
    ) { }

    async createPayment(payload: CreatePaymentDto) {
        return await this.cnx.transaction(async () => {
            try {
                const methodPayment = await this.serviceMethodPayment.getById(payload.methodPaymentId);

                const lease = await this.serviceLease.getById(payload.leaseId);

                const data = {
                    amount: payload.amount,
                    date: payload.date,
                    lease,
                    methodPayment,
                } as PaymentEntity;

                const insert = await this.repo.createPayment(data);

                if (!insert)
                    throw new HttpException("Error en crear pago", HttpStatus.BAD_REQUEST);

                return insert.id;
            } catch (error) {
                throw error;
            }
        });
    }

    async getAll() {
        try {
            const payments = await this.repo.getAll();

            if (!payments)
                throw new HttpException("Error en obtener pagos", HttpStatus.NOT_FOUND);

            return payments;
        } catch (error) {
            throw error;
        }
    }

    async getPaymentByApartment(id: number, pagination?: PaginationDto, startDate?: Date, endDate?: Date) {
        try {
            await this.serviceApartment.getById(id);

            const payments = await this.repo.getPaymentByApartment(id, pagination, startDate, endDate);

            if (!payments)
                throw new HttpException("Error en obtener pagos", HttpStatus.INTERNAL_SERVER_ERROR);

            return payments;
        } catch (error) {
            throw error;
        }
    }

    async getPaymentsByTenant(id: number, pagination?: PaginationDto, startDate?: Date, endDate?: Date) {
        try {
            await this.serviceTenant.getById(id);

            const payments = await this.repo.getPaymentByTenant(id, pagination, startDate, endDate);

            if (!payments)
                throw new HttpException("Error en obtener pagos", HttpStatus.INTERNAL_SERVER_ERROR);

            return payments;
        } catch (error) {
            throw error;
        }
    }
}
