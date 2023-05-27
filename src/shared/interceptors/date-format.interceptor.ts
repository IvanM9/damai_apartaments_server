import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as moment from 'moment-timezone';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DateFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((element) => {
        if (!element) return;

        if (Array.isArray(element.data)) {
          element.data = element.data.map((item) => this.formatDates(item));
        } else if (Array.isArray(element)) {
          element = element.map((item) => this.formatDates(item));
        } else if (element.data) {
          element.data = this.formatDates(element.data);
        } else {
          element = this.formatDates(element);
        }

        return element;
      }),
    );
  }

  private formatDate(date: Date): string {
    return moment(date)
      .locale('es')
      .tz('America/Guayaquil')
      .format('dddd, MMMM D YYYY, h:mm:ss a');
  }

  private formatDates(data: any): any {
    const formattedData = { ...data };

    if (formattedData.createdAt) {
      formattedData.createdAt = this.formatDate(formattedData.createdAt);
    }
    if (formattedData.updatedAt) {
      formattedData.updatedAt = this.formatDate(formattedData.updatedAt);
    }
    return formattedData;
  }
}
