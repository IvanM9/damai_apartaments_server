import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateApartmentI } from '@services/apartment/aparment.dto';
import { ApartmentService } from '@services/apartment/apartment.service';

@Controller('apartment')
@ApiTags('apartment')
export class ApartmentController {
  constructor(private service: ApartmentService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un apartamento' })
  async create(@Body() payload: CreateApartmentI) {
    return await this.service.create(payload);
  }

  @Get()
  @ApiQuery({ name: 'busy', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'Listar apartamentos' })
  async getAll(@Query('busy') busy: boolean, @Query('status') status: boolean) {
    return await this.service.getAll(busy, status);
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Actualizar un apartamento' })
  async update(@Param('id') id: number, @Body() payload: CreateApartmentI) {
    return await this.service.update(id, payload);
  }

  @Put('update-status/:id')
  @ApiOperation({ summary: 'Actualizar el estado de un apartamento' })
  async updateStatus(
    @Param('id') id: number,
    @Query('status') status: boolean,
  ) {
    return await this.service.updateStatus(id, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un apartamento' })
  async getById(@Param('id') id: number) {
    return await this.service.getById(id);
  }
}
