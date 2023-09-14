import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TenantService } from '@services/tenant/tenant.service';
import { CreateTenantI } from '@services/tenant/tentant.dto';

@Controller('tenant')
@ApiTags('Tenant')
export class TenantController {
  constructor(private service: TenantService) {}

  @Post()
  @ApiOperation({ summary: 'Agregar un inquilino' })
  async create(@Body() payload: CreateTenantI) {
    return await this.service.create(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Listar inquilinos' })
  async findAll() {
    return await this.service.findAll();
  }

  @Put('/update/:id')
  @ApiOperation({ summary: 'Actualizar datos de un inquilino' })
  async update(@Param('id') id: number, @Body() payload: CreateTenantI) {
    return await this.service.update(id, payload);
  }

  @Put('/update-status/:id')
  @ApiOperation({ summary: 'Actualizar el estado de un inquilino' })
  async updateStatus(
    @Param('id') id: number,
    @Query('status') status: boolean,
  ) {
    return await this.service.updateStatus(id, status);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener un inquilino' })
  async getById(@Param('id') id: number) {
    return await this.service.getById(id);
  }
}
