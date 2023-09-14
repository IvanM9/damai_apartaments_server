import { HttpException, Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import fs from 'fs';

@Injectable()
export class BackupService {
  constructor(@InjectEntityManager() private cnx: EntityManager) {}

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

      const tables = await this.cnx.query(
        "SELECT name FROM sqlite_master WHERE type='table'",
      );

      for (const table of tables) {
        workbook.addWorksheet(table.name);
        const worksheet = await workbook.getWorksheet(table.name);
        if (
          table.name !== 'sqlite_sequence' &&
          table.name !== 'query-result-cache'
        ) {
          const data = await this.cnx.query(`SELECT * FROM ${table.name}`);

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
      }

      return await workbook.xlsx.writeBuffer();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
