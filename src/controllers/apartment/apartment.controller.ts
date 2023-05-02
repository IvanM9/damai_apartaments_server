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
        try {
            return await this.service.create(payload);
        } catch (error) {
            throw new HttpException(error.message, 400)
        }
    }

    @Get()
    @ApiQuery({ name: 'busy', required: false })
    @ApiQuery({ name: 'status', required: false })
    async getAll(@Query('busy') busy: boolean, @Query('status') status: boolean) {
        try {
            return await this.service.getAll(busy, status);
        } catch (error) {
            throw new HttpException(error.message, 400)
        }
    }

    @Put("update/:id")
    async update(@Param('id') id: number, @Body() payload: CreateApartmentI) {
        try {
            return await this.service.update(id, payload);
        } catch (error) {
            throw new HttpException(error.message, 400)
        }
    }

    @Put("update-status/:id")
    async updateStatus(@Param('id') id: number, @Query('status') status: boolean) {
        try {
            return await this.service.updateStatus(id, status);
        } catch (error) {
            throw new HttpException(error.message, 400)
        }
    }

}
