import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateApartmentI } from './aparment.dto';
import { PrismaService } from '@/libs/prisma.service';

@Injectable()
export class ApartmentService {
  constructor(private cnx: PrismaService) {}

  async create(payload: CreateApartmentI) {
    return await this.cnx.$transaction(async () => {
      try {
        const exist = await this.cnx.apartment.findFirst({
          where: {
            name: payload.name,
          },
        });

        if (exist)
          throw new HttpException(
            'Ya existe un apartamento con ese nombre',
            HttpStatus.BAD_REQUEST,
          );

        const insert = await this.cnx.apartment
          .create({
            data: {
              ...payload,
            },
          })
          .catch((error) => {
            throw new HttpException(
              'Error al crear el apartamento',
              HttpStatus.BAD_REQUEST,
            );
          });

        return insert;
      } catch (error) {
        throw error;
      }
    });
  }

  async update(id: string, payload: CreateApartmentI) {
    return await this.cnx.$transaction(async (cnxt) => {
      try {
        const update = await cnxt.apartment
          .update({
            where: {
              id,
            },
            data: {
              ...payload,
            },
          })
          .catch((error) => {
            throw new HttpException(
              `Error al actualizar el apartamento con id: ${id}`,
              HttpStatus.BAD_REQUEST,
            );
          });

        return update;
      } catch (error) {
        throw error;
      }
    });
  }

  async updateStatus(id: string, status: boolean) {
    return await this.cnx.$transaction(async (cnxt) => {
      try {
        status = status ?? !(await this.getById(id)).status;
        const update = await cnxt.apartment
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
              `Error al actualizar el estado del apartamento con id: ${id}`,
              HttpStatus.BAD_REQUEST,
            );
          });

        return update;
      } catch (error) {
        throw error;
      }
    });
  }

  async getAll(busy?: boolean, status?: boolean) {
    try {
      const apartments = await this.cnx.apartment
        .findMany({
          where: {
            busy,
            status,
          },
          select: {
            id: true,
            name: true,
            numberOfRooms: true,
            monthlyRent: true,
            status: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            name: 'asc',
          },
        })
        .catch((error) => {});

      if (apartments == null) {
        throw new HttpException(
          'Error al obtener los apartamentos',
          HttpStatus.NOT_FOUND,
        );
      }

      return apartments;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string) {
    try {
      const apartment = await this.cnx.apartment
        .findUnique({
          where: {
            id,
          },
          select: {
            id: true,
            name: true,
            numberOfRooms: true,
            monthlyRent: true,
            status: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            busy: true,
            leases: {
              select: {
                id: true,
                tenant: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
                startDate: true,
                endDate: true,
              },
              orderBy: {
                startDate: 'desc',
              },
            },
          },
        })
        .catch((error) => {
          throw new HttpException(
            `Error al obtener el apartamento con id: ${id}`,
            HttpStatus.NOT_FOUND,
          );
        });

      return apartment;
    } catch (error) {
      throw error;
    }
  }

  async updateBusy(id: string, busy: boolean) {
    try {
      const update = await this.cnx.apartment
        .update({
          where: {
            id,
          },
          data: {
            busy,
          },
        })
        .catch((error) => {
          throw new HttpException(
            `Error al actualizar el estado de ocupado del apartamento con id: ${id}`,
            HttpStatus.NOT_MODIFIED,
          );
        });

      return update;
    } catch (error) {
      throw error;
    }
  }
}
