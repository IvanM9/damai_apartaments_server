import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateBankDto } from '@services/bank/bank.dto';
import { BankService } from '@services/bank/bank.service';
import { PaginationDto } from '@shared/interfaces/pagination.dto';
import { environment } from '@shared/constants/environment';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('bank')
@ApiTags('bank')
@UseInterceptors(CacheInterceptor)
export class BankController {
  constructor(private service: BankService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un banco' })
  async create(@Body() payload: CreateBankDto) {
    try {
      return await this.service.createBank(payload);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los bancos' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getAll(
    @Query('status') status: boolean,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      const filters = {
        status: String(status) === 'true' || status == undefined,
        limit: limit ?? environment.limit,
        page: page ?? environment.page,
      } as PaginationDto;

      return await this.service.getAll(filters);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un banco por id' })
  async getById(@Param('id') id: number) {
    try {
      return await this.service.getById(id);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un banco por id' })
  async updateBank(@Param('id') id: number, @Body() payload: CreateBankDto) {
    try {
      return await this.service.updateBank(id, payload);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Patch(':id/:status')
  @ApiOperation({ summary: 'Actualizar el estado de un banco por id' })
  async updateStatus(
    @Param('id') id: number,
    @Param('status') status: boolean,
  ) {
    try {
      return await this.service.updateStatus(id, String(status) === 'true');
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
