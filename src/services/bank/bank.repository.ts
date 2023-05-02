import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { BankEntity } from "src/Models/bank.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class BankRepository{
    constructor(@InjectEntityManager() private cnx: EntityManager){}
    
    async createBank(payload: BankEntity){
        const insert = this.cnx.create(BankEntity, payload)

        return await this.cnx.save(insert);
    }

    async getById(id: number){
        return await this.cnx.findOne(BankEntity, {where: {id}});
    }
}