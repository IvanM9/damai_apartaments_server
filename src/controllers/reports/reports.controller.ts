import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ReportsService } from '@services/reports/reports.service';
import { Response } from 'express';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('reports')
@ApiTags('reports')
@UseInterceptors(CacheInterceptor)
export class ReportsController {
  constructor(private service: ReportsService) {}

  @Get('by-month')
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'month', required: true })
  async generatePDFByMonth(
    @Res() res: Response,
    @Query('year') year: string,
    @Query('month') month: number,
  ) {
    const buffer = await this.service.getPDFByMonth(year, month);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=reporte_mes_${month}_del_${
        year ?? new Date().getFullYear()
      }.pdf`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }

  @Get('by-apartment/:id')
  @ApiQuery({ name: 'year', required: false })
  async generatePDFByApartment(
    @Res() res: Response,
    @Query('year') year: string,
    @Param('id') id: number,
  ) {
    const buffer = await this.service.getPDFByApartment(id, year);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=reporte_apartamento.pdf`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }

  @Get('by-tenant/:id')
  @ApiQuery({ name: 'year', required: false })
  async generatePDFByTenant(
    @Res() res: Response,
    @Query('year') year: string,
    @Param('id') id: number,
  ) {
    const buffer = await this.service.getPDFByTenant(id, year);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=reporte_inquilino.pdf`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }

  @Get('by-year')
  @ApiQuery({ name: 'year', required: true })
  async generatePDFByYear(@Res() res: Response, @Query('year') year: string) {
    const buffer = await this.service.getPDFByYear(year);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=reporte_del_${year}.pdf`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }
}
