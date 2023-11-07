import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MethodPaymentRepository } from './method-payment.repository';
import { CreateMethodPaymentDto } from './method-payment.dto';
import { MethodPaymentEntity } from '@models/method-payment.entity';
import { PaginationDto } from '@shared/interfaces/pagination.dto';

@Injectable()
export class MethodPaymentService {
  constructor(private repository: MethodPaymentRepository) {}

  async createMethodPayment(payload: CreateMethodPaymentDto) {
    const insert = {
      name: payload.name,
      description: payload.description,
    } as MethodPaymentEntity;

    const result = await this.repository.createMethodPayment(insert);

    if (!result) {
      throw new BadRequestException('Error en registrar el metodo de pago');
    }

    return result;
  }

  async getById(id: number) {
    const result = await this.repository.getById(id);

    if (!result) {
      throw new NotFoundException('Error en obtener el método de pago');
    }

    return result;
  }

  async getAll(params?: PaginationDto) {
    const result = await this.repository.getAll(params);

    if (!result) {
      throw new NotFoundException('Error en obtener los métodos de pago');
    }

    return result;
  }

  async updateStatus(id: number, status: boolean) {
    const updated = await this.repository.updateStatus(
      id,
      String(status) === 'true',
    );

    if (updated.affected === 0) {
      throw new BadRequestException(
        'Error en actualizar el estado del método de pago',
      );
    }

    return updated.affected;
  }

  async update(id: number, payload: CreateMethodPaymentDto) {
    const insert = {
      name: payload.name,
      description: payload.description,
    } as MethodPaymentEntity;

    const updated = await this.repository.update(id, insert);

    if (updated.affected === 0) {
      throw new BadRequestException('Error en actualizar el método de pago');
    }

    return updated.affected;
  }
}
