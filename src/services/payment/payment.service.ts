import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto, UpdatePaymentDto } from './payment.dto';
import { LeaseService } from '../lease/lease.service';
import { PaginationDto } from '@shared/interfaces/pagination.dto';
import { ApartmentService } from '../apartment/apartment.service';
import { TenantService } from '../tenant/tenant.service';
import { updateFailed, updateSuccessful } from '@shared/constants/messages';
import { PrismaService } from '@/libs/prisma.service';
import { PaymentsTableI } from '@/shared/interfaces/tables.interface';

@Injectable()
export class PaymentService {
  constructor(
    private cnx: PrismaService,
    private serviceLease: LeaseService,
    private serviceApartment: ApartmentService,
    private serviceTenant: TenantService,
  ) {}

  async createPayment(payload: CreatePaymentDto) {
    return await this.cnx.$transaction(async (cnxt) => {
      try {
        const methodPayment = await cnxt.methodPayment.findUnique({
          where: {
            id: payload.methodPaymentId,
          },
        });

        const lease = await this.serviceLease.getById(payload.leaseId);

        if (lease.status == false)
          throw new HttpException(
            'El contrato esta inactivo',
            HttpStatus.BAD_REQUEST,
          );

        const insert = await cnxt.payment
          .create({
            data: {
              amount: payload.amount,
              date: payload.date,
              methodPayment: {
                connect: {
                  id: payload.methodPaymentId,
                },
              },
              lease: {
                connect: {
                  id: payload.leaseId,
                },
              },
            },
          })
          .catch((error) => {
            throw new HttpException(
              'Error en crear pago',
              HttpStatus.BAD_REQUEST,
            );
          });

        return insert.id;
      } catch (error) {
        throw error;
      }
    });
  }

  async getAll() {
    try {
      const payments = await this.cnx.payment.findMany({
        select: {
          id: true,
          amount: true,
          date: true,
          createdAt: true,
          updatedAt: true,
          lease: {
            select: {
              id: true,
              apartment: {
                select: {
                  name: true,
                },
              },
              tenant: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      if (!payments)
        throw new HttpException('Error en obtener pagos', HttpStatus.NOT_FOUND);

      return payments;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentByApartment(
    id: string,
    pagination?: PaginationDto,
    startDate?: Date,
    endDate?: Date,
  ): Promise<PaymentsTableI> {
    try {
      await this.serviceApartment.getById(id);

      const payments = await this.cnx.payment
        .findMany({
          where: {
            id,
            AND: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          select: {
            id: true,
            amount: true,
            date: true,
            createdAt: true,
            updatedAt: true,
            lease: {
              select: {
                id: true,
                apartment: {
                  select: {
                    name: true,
                  },
                },
                tenant: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
          take: pagination.limit,
          skip: (pagination.page - 1) * pagination.limit,
        })
        .catch((error) => {
          throw new HttpException(
            'Error en obtener pagos',
            HttpStatus.BAD_REQUEST,
          );
        });

      return {
        data: payments,
        total: payments.length,
        totalPayments: payments
          .reduce((acc, curr) => acc + Number(curr.amount), 0)
          .toString(),
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(payments.length / pagination.limit),
        status: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async getPaymentsByTenant(
    id: string,
    pagination?: PaginationDto,
    startDate?: Date,
    endDate?: Date,
  ): Promise<PaymentsTableI> {
    try {
      await this.serviceTenant.getById(id);

      const payments = await this.cnx.payment
        .findMany({
          where: {
            id,
            AND: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          select: {
            id: true,
            amount: true,
            date: true,
            createdAt: true,
            updatedAt: true,
            lease: {
              select: {
                id: true,
                apartment: {
                  select: {
                    name: true,
                  },
                },
                tenant: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
          take: pagination.limit,
          skip: (pagination.page - 1) * pagination.limit,
        })
        .catch((error) => {
          throw new HttpException(
            'Error en obtener pagos',
            HttpStatus.BAD_REQUEST,
          );
        });

      return {
        data: payments,
        total: payments.length,
        totalPayments: payments
          .reduce((acc, curr) => acc + Number(curr.amount), 0)
          .toString(),
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(payments.length / pagination.limit),
        status: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, payload: UpdatePaymentDto) {
    try {
      const methodPayment = await this.cnx.methodPayment
        .findUnique({
          where: {
            id: payload.methodPaymentId,
          },
        })
        .catch((error) => {
          throw new NotFoundException('Metodo de pago no encontrado');
        });

      const updated = await this.cnx.payment
        .update({
          where: {
            id,
          },
          data: {
            amount: payload.amount,
            date: payload.date,
            methodPayment: {
              connect: {
                id: payload.methodPaymentId,
              },
            },
          },
        })
        .catch((error) => {
          throw new HttpException(
            'Error en actualizar pago',
            HttpStatus.BAD_REQUEST,
          );
        });

      return updateSuccessful(`El pago con id ${id}`);
    } catch (error) {
      throw error;
    }
  }

  async getByYearOrMonth(year?: string, month?: number) {
    try {
      const data = await this.cnx.payment.findMany({
        select: {
          id: true,
          amount: true,
          date: true,
          createdAt: true,
          updatedAt: true,
          lease: {
            select: {
              tenant: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              apartment: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        where: {
          date: month
            ? {
                gte: new Date(`${year}-${month}-01`),
                lte: new Date(`${year}-${month}-31`),
              }
            : {
                gte: new Date(`${year}-01-01`),
                lte: new Date(`${year}-12-31`),
              },
        },
        orderBy: {
          date: 'asc',
        },
      });

      if (!data)
        throw new HttpException(
          'Error en obtener los pagos',
          HttpStatus.BAD_REQUEST,
        );

      let total = 0;

      data.forEach((payment) => {
        total += payment.amount as unknown as number;
      });

      return {
        payments: data,
        total,
      };
    } catch (error) {
      throw error;
    }
  }

  async getPaymentsByLease(
    id: string,
    pagination?: PaginationDto,
    startDate?: Date,
    endDate?: Date,
  ): Promise<PaymentsTableI> {
    try {
      await this.serviceLease.getById(id);

      const payments = await this.cnx.payment
        .findMany({
          where: {
            id,
            AND: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          select: {
            id: true,
            amount: true,
            date: true,
            createdAt: true,
            updatedAt: true,
            lease: {
              select: {
                id: true,
                apartment: {
                  select: {
                    name: true,
                  },
                },
                tenant: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
          take: pagination.limit,
          skip: (pagination.page - 1) * pagination.limit,
        })
        .catch((error) => {
          throw new HttpException(
            'Error en obtener pagos',
            HttpStatus.BAD_REQUEST,
          );
        });

      return {
        data: payments,
        total: payments.length,
        totalPayments: payments
          .reduce((acc, curr) => acc + Number(curr.amount), 0)
          .toString(),
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(payments.length / pagination.limit),
        status: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async getValuesGeneral() {
    try {
      const yearValues = await this.cnx.payment
        .findMany({
          select: {
            amount: true,
            date: true,
          },
          orderBy: {
            date: 'asc',
          },
          where: {
            date: {
              gte: new Date(`${new Date().getFullYear()}-01-01`),
              lte: new Date(`${new Date().getFullYear()}-12-31`),
            },
          },
        })
        .catch((error) => {
          throw new HttpException(
            'Error en obtener pagos',
            HttpStatus.BAD_REQUEST,
          );
        });

      const monthValues = await this.cnx.payment
        .findMany({
          select: {
            amount: true,
            date: true,
          },
          orderBy: {
            date: 'asc',
          },
          where: {
            date: {
              gte: new Date(
                `${new Date().getFullYear()}-${new Date().getMonth()}-01`,
              ),
              lte: new Date(
                `${new Date().getFullYear()}-${new Date().getMonth()}-31`,
              ),
            },
          },
        })
        .catch((error) => {
          throw new HttpException(
            'Error en obtener pagos',
            HttpStatus.BAD_REQUEST,
          );
        });

      return {
        year: yearValues
          .reduce((acc, curr) => acc + Number(curr.amount), 0)
          .toString(),
        month: monthValues
          .reduce((acc, curr) => acc + Number(curr.amount), 0)
          .toString(),
      };
    } catch (error) {
      throw error;
    }
  }
}
