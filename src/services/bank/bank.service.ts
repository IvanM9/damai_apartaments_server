import { Injectable } from '@nestjs/common';
import { BankRepository } from './bank.repository';
import { CreateBankDto } from './bank.dto';
import { BankEntity } from 'src/Models/bank.entity';

@Injectable()
export class BankService {
    constructor(private repository: BankRepository){}

    async createBank(payload: CreateBankDto){
        try {
            const insert = {
                name: payload.name,
                description: payload.description
            } as BankEntity;

            const result = await this.repository.createBank(insert);

            if(!result){
                throw new Error("Error en registrar el banco");
            }

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getById(id: number){
        try {
            const result = await this.repository.getById(id);

            if(!result){
                throw new Error("Error en obtener el banco");
            }

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
