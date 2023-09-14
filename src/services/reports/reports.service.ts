import { HttpException, Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { renderFile } from 'ejs';
import { PaymentService } from '../payment/payment.service';
import { FormatDateService } from '@shared/services/format-date/format-date.service';
import { PaymentRepository } from '../payment/payment.repository';

@Injectable()
export class ReportsService {
  constructor(
    private readonly paymentService: PaymentService,
    private formatDateService: FormatDateService,
    private paymentRepo: PaymentRepository,
  ) {}

  async getPDFByMonth(year: string, month: number) {
    try {
      const data = await this.paymentRepo.getByYearOrMonth(year, month);

      return await this.generatePDF(data);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  async getPDFByApartment(apartmentId: number, year?: string) {
    try {
      year = year ?? new Date().getFullYear().toString();
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);

      const data = (
        await this.paymentRepo.getPaymentByApartment(
          apartmentId,
          {
            page: 1,
            limit: 1000,
            status: true,
            search: null,
          },
          startDate,
          endDate,
        )
      ).data;

      return await this.generatePDF(data);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  async getPDFByTenant(tenantId: number, year?: string) {
    try {
      year = year ?? new Date().getFullYear().toString();
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);

      const data = (
        await this.paymentRepo.getPaymentByTenant(
          tenantId,
          {
            page: 1,
            limit: 1000,
            status: true,
            search: null,
          },
          startDate,
          endDate,
        )
      ).data;

      return await this.generatePDF(data);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  async getPDFByYear(year: string) {
    try {
      const data = await this.paymentRepo.getByYearOrMonth(year);

      return await this.generatePDF(data);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  private async generatePDF(info: any) {
    try {
      const data = {
        title: 'Pagos',
        rows: await this.getDataPayments(info),
      };

      const templatePath = 'views/reports.ejs';

      return new Promise<Buffer>((resolve, reject) => {
        renderFile(templatePath, data, async (err, html) => {
          if (err) {
            reject(err);
            return;
          }

          const browser = await puppeteer.launch({ headless: 'new' });

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

  private async getDataPayments(info: any) {
    const data = [];
    let i = 0;

    for (const element of info) {
      const tenantName =
        element?.lease?.tenant?.firstname ?? element?.tenantFirstname;
      const tenantLastname =
        element?.lease?.tenant?.lastname ?? element?.tenantLastname;

      data.push({
        id: ++i,
        amount: element.amount,
        date: this.formatDateService.formatDates({ createdAt: element.date })
          .createdAt,
        tenant: `${tenantName} ${tenantLastname}`,
        apartment: element?.lease?.apartment?.name ?? element?.apartmentName,
      });
    }

    return data;
  }
}
