import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTenantI } from './tentant.dto';
import { PrismaService } from '@/libs/prisma.service';

@Injectable()
export class TenantService {
  constructor(private db: PrismaService) {}

  async findAll() {
    try {
      const tenants = await this.db.tenant.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          identification: true,
          phone: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!tenants)
        throw new HttpException(
          'No se encontraron inquilinos',
          HttpStatus.NOT_FOUND,
        );

      return tenants;
    } catch (error) {
      throw error;
    }
  }

  async create(payload: CreateTenantI) {
    return await this.db.$transaction(async (cnx) => {
      try {
        const insert = await cnx.tenant.create({
          data: {
            ...payload,
          },
        });

        if (insert === null)
          throw new HttpException(
            'No se pudo crear el inquilino',
            HttpStatus.BAD_REQUEST,
          );

        return insert;
      } catch (error) {
        throw error;
      }
    });
  }

  async update(id: string, payload: CreateTenantI) {
    try {
      const updated = await this.db.tenant
        .update({
          where: { id },
          data: {
            ...payload,
          },
        })
        .catch((error) => {
          throw new HttpException(
            `No se pudo actualizar el inquilino con id ${id}`,
            HttpStatus.NOT_MODIFIED,
          );
        });

      return updated;
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(id: string) {
    try {
      const updated = await this.db.tenant
        .update({
          where: { id },
          data: {
            isActive: true,
          },
        })
        .catch((error) => {
          throw new HttpException(
            `No se pudo actualizar el estado del inquilino con id ${id}`,
            HttpStatus.NOT_MODIFIED,
          );
        });

      return updated;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string) {
    try {
      const tenant = await this.db.tenant
        .findUnique({
          where: { id },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            identification: true,
            phone: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            leases: {
              select: {
                id: true,
                startDate: true,
                endDate: true,
                monthlyRent: true,
                description: true,
                apartment: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        })
        .catch((error) => {
          throw new HttpException(
            `No se pudo encontrar el inquilino con id ${id}`,
            HttpStatus.NOT_FOUND,
          );
        });

      return tenant;
    } catch (error) {
      throw error;
    }
  }
}
