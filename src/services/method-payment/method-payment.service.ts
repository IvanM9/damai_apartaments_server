import { Injectable } from '@nestjs/common';
import { MethodPaymentRepository } from './method-payment.repository';
import { CreateMethodPaymentDto } from './method-payment.dto';
import { MethodPaymentEntity } from 'src/Models/method-payment.entity';
import { BankService } from '../bank/bank.service';
import { PaginationDto } from 'src/shared/interfaces/pagination.dto';

@Injectable()
export class MethodPaymentService {
  constructor(
    private repository: MethodPaymentRepository,
    private bankService: BankService,
  ) {}

  async createMethodPayment(payload: CreateMethodPaymentDto) {
    try {
      const bank = await this.bankService.getById(payload.bankId);

      const insert = {
        name: payload.name,
        description: payload.description,
        bank,
      } as MethodPaymentEntity;

      const result = await this.repository.createMethodPayment(insert);

      if (!result) {
        throw new Error('Error en registrar el metodo de pago');
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
        throw new Error('Error en obtener el método de pago');
      }

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAll(params?: PaginationDto) {
    try {
      const result = await this.repository.getAll(params);

      if (!result) {
        throw new Error('Error en obtener los métodos de pago');
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(id: number, status: boolean) {
    try {
      const updated = await this.repository.updateStatus(
        id,
        String(status) === 'true',
      );

      if (updated.affected === 0) {
        throw new Error('Error en actualizar el estado del método de pago');
      }

      return updated.affected;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, payload: CreateMethodPaymentDto) {
    try {
      const bank = await this.bankService.getById(payload.bankId);

      const insert = {
        name: payload.name,
        description: payload.description,
        bank,
      } as MethodPaymentEntity;

      const updated = await this.repository.update(id, insert);

      if (updated.affected === 0) {
        throw new Error('Error en actualizar el método de pago');
      }

      return updated.affected;
    } catch (error) {
      throw error;
    }
  }
}
