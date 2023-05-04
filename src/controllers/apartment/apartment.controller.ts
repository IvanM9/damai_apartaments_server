import { Body, Controller, Get, HttpException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateApartmentI } from 'src/services/apartment/aparment.dto';
import { ApartmentService } from 'src/services/apartment/apartment.service';

@Controller('apartment')
@ApiTags('apartment')
export class ApartmentController {
    constructor(private service: ApartmentService) { }

    @Post()
    async create(@Body() payload: CreateApartmentI) {
        return await this.service.create(payload);
    }

    @Get()
    @ApiQuery({ name: 'busy', required: false })
    @ApiQuery({ name: 'status', required: false })
    async getAll(@Query('busy') busy: boolean, @Query('status') status: boolean) {
        return await this.service.getAll(busy, status);
    }

    @Put("update/:id")
    async update(@Param('id') id: number, @Body() payload: CreateApartmentI) {
        return await this.service.update(id, payload);
    }

    @Put("update-status/:id")
    async updateStatus(@Param('id') id: number, @Query('status') status: boolean) {
        return await this.service.updateStatus(id, status);
    }

}
