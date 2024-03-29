import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';

@Injectable()
export class FormatDateService {
  private formatDate(date: Date): string {
    return moment(date)
      .locale('es')
      .tz('America/Guayaquil')
      .format('dddd, MMMM D YYYY, h:mm a');
  }

  public formatDates(data: any): any {
    const formattedData = { ...data };

    if (formattedData.createdAt) {
      formattedData.createdAt = this.formatDate(formattedData.createdAt);
    }
    if (formattedData.updatedAt) {
      formattedData.updatedAt = this.formatDate(formattedData.updatedAt);
    }
    return formattedData as { createdAt: string; updatedAt: string };
  }
}
