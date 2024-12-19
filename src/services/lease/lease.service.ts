import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ApartmentService } from '../apartment/apartment.service';
import { CreateLeaseDto, UpdateLeaseDto } from './lease.dto';
import { TenantService } from '../tenant/tenant.service';
import { updateFailed, updateSuccessful } from '@shared/constants/messages';
import { PrismaService } from '@/libs/prisma.service';

@Injectable()
export class LeaseService {
  constructor(
    private apartmentService: ApartmentService,
    private tenantService: TenantService,
    private db: PrismaService,
  ) {}

  async createLease(payload: CreateLeaseDto) {
    return await this.db.$transaction(async () => {
      try {
        const apartment = await this.apartmentService.getById(
          payload.apartmentId,
        );

        if (apartment.busy)
          throw new HttpException(
            'El apartamento ya tiene un contrato',
            HttpStatus.BAD_REQUEST,
          );

        const tenant = await this.tenantService.getById(payload.tenantId);

        const exist = await this.db.lease.count({
          where: {
            tenantId: payload.tenantId,
            apartmentId: payload.apartmentId,
          },
        });

        if (exist > 0)
          throw new HttpException(
            'El inquilino ya tiene un contrato con este apartamento',
            HttpStatus.BAD_REQUEST,
          );

        const insert = await this.db.lease
          .create({
            data: {
              startDate: payload.startDate,
              endDate: payload.endDate,
              apartment: {
                connect: {
                  id: apartment.id,
                },
              },
              tenant: {
                connect: {
                  id: tenant.id,
                },
              },
              description: payload.description,
              monthlyRent: payload.monthlyRent,
            },
          })
          .catch((error) => {
            throw new HttpException(
              'Error en crear contrato',
              HttpStatus.BAD_REQUEST,
            );
          });

        await this.apartmentService.updateBusy(payload.apartmentId, true);

        return insert;
      } catch (error) {
        throw error;
      }
    });
  }

  async getAll() {
    try {
      const data = await this.db.lease
        .findMany({
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
            monthlyRent: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            apartment: {
              select: {
                id: true,
                name: true,
              },
            },
            tenant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })
        .catch((error) => {
          throw new HttpException(
            'Error en obtener contratos',
            HttpStatus.BAD_REQUEST,
          );
        });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string) {
    try {
      const data = await this.db.lease
        .findUnique({
          where: {
            id,
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
            monthlyRent: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            apartment: {
              select: {
                id: true,
                name: true,
              },
            },
            tenant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        })
        .catch((error) => {
          throw new HttpException(
            'Error en obtener contrato',
            HttpStatus.BAD_REQUEST,
          );
        });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(id: string, status: boolean) {
    return await this.db.$transaction(async (cnx) => {
      try {
        const lease = await this.getById(id);

        await cnx.lease
          .update({
            where: {
              id,
            },
            data: {
              status,
            },
          })
          .catch((error) => {
            throw new HttpException(
              updateFailed(`contrato con id ${id}`),
              HttpStatus.BAD_REQUEST,
            );
          });

        await this.apartmentService.updateBusy(lease.apartment.id, status);

        return updateSuccessful(`contrato con id ${id}`);
      } catch (error) {
        throw error;
      }
    });
  }

  async update(id: string, payload: UpdateLeaseDto) {
    try {
      const updated = await this.db.lease
        .update({
          where: {
            id,
          },
          data: {
            startDate: payload.startDate,
            endDate: payload.endDate,
            description: payload.description,
            monthlyRent: payload.monthlyRent,
          },
        })
        .catch((error) => {
          throw new HttpException(
            updateFailed(`contrato con id ${id}`),
            HttpStatus.BAD_REQUEST,
          );
        });

      return updateSuccessful(`contrato con id ${id}`);
    } catch (error) {
      throw error;
    }
  }

  async getToBeExpired() {
    try {
      const otherDate = new Date();
      otherDate.setDate(otherDate.getDate() + 5);

      const data = await this.db.lease
        .findMany({
          where: {
            AND: [
              {
                endDate: {
                  gte: new Date(),
                },
              },
              {
                endDate: {
                  lte: otherDate,
                },
              },
            ],
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            apartment: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        })
        .catch((error) => {
          throw new HttpException(
            'Error en obtener contratos',
            HttpStatus.BAD_REQUEST,
          );
        });

      return data;
    } catch (error) {
      throw error;
    }
  }
}
