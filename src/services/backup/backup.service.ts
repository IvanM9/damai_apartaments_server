import { PrismaService } from '@/libs/prisma.service';
import { HttpException, Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import fs from 'fs';

@Injectable()
export class BackupService {
  constructor(private cnx: PrismaService) {}

  getBackup() {
    try {
      return fs.readFileSync(`damai.sqlite`);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async getExcelBackup() {
    try {
      const workbook = new ExcelJS.Workbook();

      const tables: any[] = await this.cnx.$queryRaw`
        SELECT table_name as name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'`;

      for (const table of tables as any[]) {
        workbook.addWorksheet(table.name);
        const worksheet = await workbook.getWorksheet(table.name);

        const data: any = await this.cnx.$queryRaw`SELECT * FROM ${table.name}`;

        if (data.length > 0) {
          const columns = Object.keys(data[0]);
          worksheet.columns = columns.map((column) => {
            return {
              header: column,
              key: column,
              width: 20,
            };
          });

          for (const row of data) {
            worksheet.addRow(Object.values(row));
          }

          worksheet.commit;
        }
      }

      return await workbook.xlsx.writeBuffer();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
