import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateLeaseDto } from 'src/services/lease/lease.dto';
import { LeaseService } from 'src/services/lease/lease.service';

@Controller('lease')
@ApiTags('Lease')
export class LeaseController {
    constructor(private service: LeaseService) { }

    @Post()
    async createLease(@Body() payload: CreateLeaseDto) {
        try {
            return await this.service.createLease(payload);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async getAll() {
        try {
            return await this.service.getAll();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
