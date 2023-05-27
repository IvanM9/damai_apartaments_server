import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { BackupService } from 'src/services/backup/backup.service';

@Controller('backup')
@ApiTags('Backup')
export class BackupController {
  constructor(private service: BackupService) {}

  @Get('sqlite')
  getBackup(@Res() res: Response) {
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="' + 'backup.sqlite' + '"',
      'x-processed-filename': 'backup.sqlite',
    });
    res.send(this.service.getBackup());
  }

  @Get('excel')
  async getExcelBackup(@Res() res: Response) {
    const excel = await this.service.getExcelBackup();

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="' + 'backup.xlsx' + '"',
      'x-processed-filename': 'backup.xlsx',
    });

    return res.send(excel);
  }
}
