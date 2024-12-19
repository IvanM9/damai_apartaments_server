import { HttpException, Injectable } from '@nestjs/common';
import { PaginationDto } from '@shared/interfaces/pagination.dto';
import { CreateMaintenanceDto, UpdateMaintenanceDto } from './maintenance.dto';
import { ApartmentService } from '../apartment/apartment.service';
import { PrismaService } from '@/libs/prisma.service';
import { TableI } from '@/shared/interfaces/tables.interface';

@Injectable()
export class MaintenanceService {
  constructor(
    private apartmentService: ApartmentService,
    private cnx: PrismaService,
  ) {}

  async getAll(params: PaginationDto): Promise<TableI> {
    try {
      const data = await this.cnx.bill.findMany({
        select: {
          id: true,
          description: true,
          amount: true,
          createdAt: true,
          updatedAt: true,
          apartment: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        take: params.limit,
        skip: (params.page - 1) * params.limit,
      });

      if (!data) throw new HttpException('No se encontraron datos', 404);

      const total = await this.cnx.bill.count({
        take: params.limit,
        skip: (params.page - 1) * params.limit,
      });

      return {
        data,
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      } as TableI;
    } catch (e) {
      throw e;
    }
  }

  async create(data: CreateMaintenanceDto) {
    return await this.cnx.$transaction(async (cnxt) => {
      try {
        const apartment = await this.apartmentService.getById(data.apartmentId);

        const created = await cnxt.bill.create({
          data: {
            amount: data.amount,
            description: data.description,
            apartment: {
              connect: {
                id: apartment.id,
              },
            },
          },
        });

        if (!created)
          throw new HttpException('No se pudo crear el mantenimiento', 500);

        return created;
      } catch (e) {
        throw e;
      }
    });
  }

  async getById(id: string) {
    try {
      const data = await this.cnx.bill.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          description: true,
          amount: true,
          createdAt: true,
          updatedAt: true,
          apartment: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!data) throw new HttpException('No se encontraron datos', 404);

      return data;
    } catch (e) {
      throw e;
    }
  }

  async update(id: string, data: UpdateMaintenanceDto) {
    try {
      const updated = await this.cnx.bill
        .update({
          where: {
            id,
          },
          data: {
            amount: data.amount,
            description: data.description,
          },
        })
        .catch((e) => {
          throw new HttpException(
            'No se pudo actualizar el mantenimiento',
            500,
          );
        });

      return updated;
    } catch (e) {
      throw e;
    }
  }

  async delete(id: string) {
    try {
      const deleted = await this.cnx.bill
        .delete({
          where: {
            id,
          },
        })
        .catch((e) => {
          throw new HttpException('No se pudo eliminar el mantenimiento', 500);
        });

      return deleted;
    } catch (e) {
      throw e;
    }
  }
}
