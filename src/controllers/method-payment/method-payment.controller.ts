import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateMethodPaymentDto } from 'src/services/method-payment/method-payment.dto';
import { MethodPaymentService } from 'src/services/method-payment/method-payment.service';

@Controller('method-payment')
@ApiTags('Method Payment')
export class MethodPaymentController {
    constructor(private service: MethodPaymentService) { }

    @Post()
    async createMethodPayment(@Body() payload: CreateMethodPaymentDto) {
        try {
            return await this.service.createMethodPayment(payload);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get(':id')
    async getById(@Param('id') id: number) {
        try {
            return await this.service.getById(id);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
