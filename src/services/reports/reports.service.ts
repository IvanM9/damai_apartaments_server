import { HttpException, Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { renderFile } from 'ejs';
import { PaymentService } from '../payment/payment.service';
import { FormatDateService } from '../../shared/services/format-date/format-date.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly paymentService: PaymentService,
    private formatDateService: FormatDateService,
  ) {}
  async generatePDF() {
    //TODO: Separar para que la función acepte un parámetro y así poder generar diferentes reportes
    try {
      const data = {
        title: 'Pagos',
        rows: await this.getDataPayments(),
      };

      const templatePath = 'src/views/reports.ejs';

      return new Promise<Buffer>((resolve, reject) => {
        renderFile(templatePath, data, async (err, html) => {
          if (err) {
            reject(err);
            return;
          }

          const browser = await puppeteer.launch();

          const page = await browser.newPage();

          await page.setContent(html);

          const buffer = await page.pdf({ format: 'A4' });

          await browser.close();

          resolve(buffer);
        });
      });
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  private async getDataPayments() {
    const data = [];
    let i = 0;

    for (const element of await this.paymentService.getAll()) {
      data.push({
        id: ++i,
        amount: element.amount,
        date: this.formatDateService.formatDates({ createdAt: element.date })
          .createdAt,
        tenant:
          element.lease.tenant.firstname + ' ' + element.lease.tenant.lastname,
        apartment: element.lease.apartment.name,
      });
    }

    return data;
  }
}
