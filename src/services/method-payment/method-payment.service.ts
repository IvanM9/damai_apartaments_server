import { Injectable } from '@nestjs/common';
import { MethodPaymentRepository } from './method-payment.repository';
import { CreateMethodPaymentDto } from './method-payment.dto';
import { MethodPaymentEntity } from 'src/Models/method-payment.entity';
import { BankService } from '../bank/bank.service';

@Injectable()
export class MethodPaymentService {
    constructor(
        private repository: MethodPaymentRepository,
        private bankService: BankService
    ) { }

    async createMethodPayment(payload: CreateMethodPaymentDto) {
        try {
            const bank = await this.bankService.getById(payload.bankId);

            const insert = {
                name: payload.name,
                description: payload.description,
                bank
            } as MethodPaymentEntity;

            const result = await this.repository.createMethodPayment(insert);

            if (!result) {
                throw new Error("Error en registrar el metodo de pago");
            }

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getById(id: number) {
        try {
            const result = await this.repository.getById(id);

            if (!result) {
                throw new Error("Error en obtener el método de pago");
            }

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
