import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBankDto } from 'src/services/bank/bank.dto';
import { BankService } from 'src/services/bank/bank.service';

@Controller('bank')
@ApiTags('bank')
export class BankController {
    constructor(private service: BankService) { }

    @Post()
    @ApiOperation({ summary: 'Registrar un banco' })
    async create(@Body() payload: CreateBankDto){
        try {
            return await this.service.createBank(payload);
        } catch (error) {
            throw new HttpException(error.message, 400)
        }
    }
}
