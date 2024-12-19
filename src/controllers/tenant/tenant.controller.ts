import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TenantService } from '@services/tenant/tenant.service';
import { CreateTenantI } from '@services/tenant/tentant.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('tenant')
@ApiTags('Tenant')
@UseInterceptors(CacheInterceptor)
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
  async update(@Param('id') id: string, @Body() payload: CreateTenantI) {
    return await this.service.update(id, payload);
  }

  @Patch('/update-status/:id')
  @ApiOperation({ summary: 'Actualizar el estado de un inquilino' })
  async updateStatus(@Param('id') id: string) {
    return await this.service.updateStatus(id);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener un inquilino' })
  async getById(@Param('id') id: string) {
    return await this.service.getById(id);
  }
}
