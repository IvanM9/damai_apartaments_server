import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMethodPaymentDto } from './method-payment.dto';
import { PaginationDto } from '@shared/interfaces/pagination.dto';
import { PrismaService } from '@/libs/prisma.service';
import { PaymentsTableI, TableI } from '@/shared/interfaces/tables.interface';

@Injectable()
export class MethodPaymentService {
  constructor(private cnx: PrismaService) {}

  async createMethodPayment(payload: CreateMethodPaymentDto) {
    const result = await this.cnx.methodPayment
      .create({
        data: {
          name: payload.name,
          description: payload.description,
        },
      })
      .catch((error) => {
        throw new BadRequestException('Error en registrar el metodo de pago');
      });

    return result;
  }

  async getById(id: string) {
    const result = await this.cnx.methodPayment
      .findUnique({
        where: {
          id,
        },
      })
      .catch((error) => {
        throw new NotFoundException('Error en obtener el método de pago');
      });

    return result;
  }

  async getAll(params?: PaginationDto): Promise<TableI> {
    const result = await this.cnx.methodPayment
      .findMany({
        take: params.limit,
        skip: (params.page - 1) * params.limit,
      })
      .catch((error) => {
        throw new NotFoundException('Error en obtener los métodos de pago');
      });

    return {
      data: result,
      page: params?.page,
      limit: params?.limit,
      total: result.length,
      totalPages: Math.ceil(result.length / params.limit),
      status: true,
    };
  }

  async updateStatus(id: string, status: boolean) {
    const updated = await this.cnx.methodPayment
      .update({
        where: {
          id,
        },
        data: {
          status,
        },
      })
      .catch((error) => {
        throw new BadRequestException(
          'Error en actualizar el estado del método de pago',
        );
      });

    return updated;
  }

  async update(id: string, payload: CreateMethodPaymentDto) {
    const updated = await this.cnx.methodPayment
      .update({
        where: {
          id,
        },
        data: {
          name: payload.name,
          description: payload.description,
        },
      })
      .catch((error) => {
        throw new BadRequestException('Error en actualizar el método de pago');
      });

    return updated;
  }
}
