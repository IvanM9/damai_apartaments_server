import { Body, Controller, HttpException, Inject, Post } from '@nestjs/common';
import { TenantService } from 'src/services/tenant/tenant.service';
import { CreateTenantI } from 'src/services/tenant/tentant.dto';

@Controller('tenant')
export class TenantController {
  constructor(private service: TenantService) {}

  @Post()
  async create(@Body() payload: CreateTenantI) {
    try {
      return await this.service.create(payload);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
