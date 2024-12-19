import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MaintenanceService } from '@/services/bill/maintenance.service';
import { PaginationDto } from '@shared/interfaces/pagination.dto';
import { environment } from '@shared/constants/environment';
import {
  CreateMaintenanceDto,
  UpdateMaintenanceDto,
} from '@/services/bill/maintenance.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('maintenance')
@ApiTags('maintenance')
@UseInterceptors(CacheInterceptor)
export class MaintenanceController {
  constructor(private maintenanceService: MaintenanceService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los mantenimientos' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getAll(@Query('page') page: number, @Query('limit') limit: number) {
    const params = {
      page: page ?? environment.page,
      limit: limit ?? environment.limit,
    } as PaginationDto;
    return await this.maintenanceService.getAll(params);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un mantenimiento' })
  async create(@Body() data: CreateMaintenanceDto) {
    return await this.maintenanceService.create(data);
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return await this.maintenanceService.getById(id);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateMaintenanceDto) {
    return await this.maintenanceService.update(id, data);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.maintenanceService.delete(id);
  }
}
