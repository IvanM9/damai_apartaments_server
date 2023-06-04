import { Injectable } from '@nestjs/common';
import { BankRepository } from './bank.repository';
import { CreateBankDto } from './bank.dto';
import { BankEntity } from 'src/Models/bank.entity';
import { PaginationDto } from '../../shared/interfaces/pagination.dto';

@Injectable()
export class BankService {
  constructor(private repository: BankRepository) {}

  async createBank(payload: CreateBankDto) {
    try {
      const insert = {
        name: payload.name,
        description: payload.description,
      } as BankEntity;

      const result = await this.repository.createBank(insert);

      if (!result) {
        throw new Error('Error en registrar el banco');
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
        throw new Error('Error en obtener el banco');
      }

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAll(filters: PaginationDto) {
    try {
      const result = await this.repository.getAll(filters);

      if (!result) {
        throw new Error('Error en obtener los bancos');
      }

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateBank(id: number, payload: CreateBankDto) {
    try {
      const data = {
        name: payload.name,
        description: payload.description,
      } as BankEntity;

      const result = await this.repository.updateBank(id, data);

      if (result.affected === 0) {
        throw new Error('Error en actualizar el banco');
      }

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateStatus(id: number, status: boolean) {
    try {
      const result = await this.repository.updateStatus(id, status);

      if (result.affected === 0) {
        throw new Error('Error en actualizar el estado del banco');
      }

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
