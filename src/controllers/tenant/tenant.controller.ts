import { Body, Controller, Get, HttpException, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TenantService } from 'src/services/tenant/tenant.service';
import { CreateTenantI } from 'src/services/tenant/tentant.dto';

@Controller('tenant')
@ApiTags('Tenant')
export class TenantController {
  constructor(private service: TenantService) { }

  @Post()
  async create(@Body() payload: CreateTenantI) {
    return await this.service.create(payload);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Put("/update/:id")
  async update(@Param('id') id: number, @Body() payload: CreateTenantI) {
    return await this.service.update(id, payload);
  }

  @Put("/update-status/:id")
  async updateStatus(@Param('id') id: number, @Query('status') status: boolean) {
    return await this.service.updateStatus(id, status);
  }

  @Get("/:id")
  async getById(@Param('id') id: number) {
    return await this.service.getById(id);
  }
}
