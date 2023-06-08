import { Controller, Get, Res } from '@nestjs/common';
import { ReportsService } from '../../services/reports/reports.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('reports')
@ApiTags('reports')
export class ReportsController {
  constructor(private service: ReportsService) {}
  @Get()
  async generatePDF(@Res() res: Response) {
    const buffer = await this.service.generatePDF();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=report.pdf',
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }
}
