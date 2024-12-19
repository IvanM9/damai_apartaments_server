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
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateApartmentI } from '@services/apartment/aparment.dto';
import { ApartmentService } from '@services/apartment/apartment.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { OptionalBooleanPipe } from '@pipes/parse-bool-optional.pipe';

@Controller('apartment')
@ApiTags('apartment')
@UseInterceptors(CacheInterceptor)
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
  async getAll(
    @Query('busy') busy: boolean,
    @Query('status', OptionalBooleanPipe) status: boolean,
  ) {
    return await this.service.getAll(busy, status);
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Actualizar un apartamento' })
  async update(@Param('id') id: string, @Body() payload: CreateApartmentI) {
    return await this.service.update(id, payload);
  }

  @Patch('update-status/:id')
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'Actualizar el estado de un apartamento' })
  async updateStatus(
    @Param('id') id: string,
    @Query('status', OptionalBooleanPipe) status: boolean,
  ) {
    return await this.service.updateStatus(id, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un apartamento' })
  async getById(@Param('id') id: string) {
    return await this.service.getById(id);
  }
}
