import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
} from 'src/services/payment/payment.dto';
import { PaymentService } from 'src/services/payment/payment.service';
import { environment } from 'src/shared/constants/environment';
import { PaginationDto } from 'src/shared/interfaces/pagination.dto';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
  constructor(private service: PaymentService) {}

  @Post()
  @ApiBody({ description: 'Create payment', type: CreatePaymentDto })
  @ApiOperation({ summary: 'Registrar pago' })
  async createPayment(@Body() payload: CreatePaymentDto) {
    return await this.service.createPayment(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pagos' })
  async getAll() {
    return await this.service.getAll();
  }

  @Get('apartment/:id')
  @ApiOperation({ summary: 'Listar pagos por apartamento' })
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

    return await this.service.getPaymentByApartment(
      id,
      pagination,
      startDate,
      endDate,
    );
  }

  @Get('tenant/:id')
  @ApiOperation({ summary: 'Listar pagos por inquilino' })
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

    return await this.service.getPaymentsByTenant(
      id,
      pagination,
      startDate,
      endDate,
    );
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Actualizar pago' })
  async update(@Param('id') id: number, @Body() payload: UpdatePaymentDto) {
    return await this.service.update(id, payload);
  }

  @Get('/by-date')
  @ApiOperation({ summary: 'Listar pagos por año o mes' })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'month', required: false })
  async getByDate(@Query('year') year: string, @Query('month') month: number) {
    return this.service.getByYearOrMonth(year, month);
  }

  @Get('/lease/:id')
  @ApiOperation({ summary: 'Listar pagos por contrato' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getPaymentsByLease(
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
    return await this.service.getPaymentsByLease(
      id,
      pagination,
      startDate,
      endDate,
    );
  }

  @Get('general-values')
  @ApiOperation({ summary: 'Obtener valores generales' })
  async getGeneralValues() {
    return await this.service.getValuesGeneral();
  }
}
