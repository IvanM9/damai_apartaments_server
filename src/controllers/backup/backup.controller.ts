import { Controller, Get, Res, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { BackupService } from '@services/backup/backup.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('backup')
@ApiTags('Backup')
@UseInterceptors(CacheInterceptor)
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
