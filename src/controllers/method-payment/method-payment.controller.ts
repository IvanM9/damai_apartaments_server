import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateMethodPaymentDto } from '@services/method-payment/method-payment.dto';
import { MethodPaymentService } from '@services/method-payment/method-payment.service';
import { environment } from '@shared/constants/environment';
import { PaginationDto } from '@shared/interfaces/pagination.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('method-payment')
@ApiTags('Method Payment')
@UseInterceptors(CacheInterceptor)
export class MethodPaymentController {
  constructor(private service: MethodPaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un método de pago' })
  async createMethodPayment(@Body() payload: CreateMethodPaymentDto) {
    try {
      return await this.service.createMethodPayment(payload);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un método de pago' })
  async getById(@Param('id') id: string) {
    try {
      return await this.service.getById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los métodos de pago' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: boolean,
  ) {
    const pagination = {
      page: page ? Number(page) : environment.page,
      limit: limit ? Number(limit) : environment.limit,
      status: String(status) === 'true' || status == undefined,
    } as PaginationDto;

    return await this.service.getAll(pagination);
  }

  @Patch(':id/:status')
  @ApiOperation({ summary: 'Modificar el estado de un método de pago' })
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: boolean,
  ) {
    return await this.service.updateStatus(id, status);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modificar un método de pago' })
  async update(
    @Param('id') id: string,
    @Body() payload: CreateMethodPaymentDto,
  ) {
    return await this.service.update(id, payload);
  }
}
