import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags, } from '@nestjs/swagger';
import { CreatePaymentDto, UpdatePaymentDto } from 'src/services/payment/payment.dto';
import { PaymentService } from 'src/services/payment/payment.service';
import { environment } from 'src/shared/constants/environment';
import { PaginationDto } from 'src/shared/interfaces/pagination.dto';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
    constructor(private service: PaymentService) { }

    @Post()
    @ApiBody({ description: 'Create payment', type: CreatePaymentDto })
    async createPayment(@Body() payload: CreatePaymentDto) {
        return await this.service.createPayment(payload);
    }

    @Get()
    async getAll() {
        return await this.service.getAll();
    }

    @Get('apartment/:id')
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'search', required: false })
    async getPaymentsByApartment(
        @Param('id') id: number,
        @Query('startDate') startDate?: Date,
        @Query('endDate') endDate?: Date,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        const pagination = {
            page: page ? Number(page) : environment.page,
            limit: limit ? Number(limit) : environment.limit,
        } as PaginationDto;

        return await this.service.getPaymentByApartment(id, pagination, startDate, endDate);
    }

    @Get('tenant/:id')
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'status', required: false })
    async getPaymentsByTenant(
        @Param('id') id: number,
        @Query('startDate') startDate?: Date,
        @Query('endDate') endDate?: Date,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        const pagination = {
            page: page ? Number(page) : environment.page,
            limit: limit ? Number(limit) : environment.limit,
        } as PaginationDto;

        return await this.service.getPaymentsByTenant(id, pagination, startDate, endDate);
    }

    @Patch('/:id')
    async update(@Param('id') id: number, @Body() payload: UpdatePaymentDto) {
        return await this.service.update(id, payload);
    }

    @Get('/by-date')
    @ApiQuery({ name: 'year', required: false })
    @ApiQuery({ name: 'month', required: false })
    async getByDate(@Query('year') year: string, @Query('month') month: number) {
        return this.service.getByYearOrMonth(year, month);
    }
}
