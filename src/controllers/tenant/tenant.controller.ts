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
    try {
      return await this.service.create(payload);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.service.findAll();
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Put("/update/:id")
  async update(@Param('id') id: number, @Body() payload: CreateTenantI) {
    try {
      return await this.service.update(id, payload);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Put("/update-status/:id")
  async updateStatus(@Param('id') id: number, @Query('status') status: boolean) {
    try {
      return await this.service.updateStatus(id, status);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get("/:id")
  async getById(@Param('id') id: number) {
    try {
      return await this.service.getById(id);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
