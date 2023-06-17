import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLeaseDto, UpdateLeaseDto } from 'src/services/lease/lease.dto';
import { LeaseService } from 'src/services/lease/lease.service';

@Controller('lease')
@ApiTags('Lease')
export class LeaseController {
  constructor(private service: LeaseService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un contrato' })
  async createLease(@Body() payload: CreateLeaseDto) {
    return await this.service.createLease(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Listar contratos' })
  async getAll() {
    return await this.service.getAll();
  }

  @Patch(':id/:status')
  @ApiOperation({ summary: 'Actualizar el estado de un contrato' })
  async updateStatus(
    @Param('id') id: number,
    @Param('status') status: boolean,
  ) {
    return await this.service.updateStatus(id, status);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un contrato' })
  async update(@Body() payload: UpdateLeaseDto, @Param('id') id: number) {
    return await this.service.update(id, payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un contrato' })
  async getById(@Param('id') id: number) {
    return await this.service.getById(id);
  }

  @Get('alert/to-be-expired')
  @ApiOperation({ summary: 'Obtener contratos a punto de expirar' })
  async getToBeExpired() {
    return await this.service.getToBeExpired();
  }
}
