import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MaintenanceController } from '@controllers/maintenance/maintenance.controller';
import { TenantService } from '@services/tenant/tenant.service';
import { ApartmentService } from '@services/apartment/apartment.service';
import { PaymentService } from '@services/payment/payment.service';
import { TenantController } from '@controllers/tenant/tenant.controller';
import { ApartmentController } from '@controllers/apartment/apartment.controller';
import { PaymentController } from '@controllers/payment/payment.controller';
import { LeaseService } from '@services/lease/lease.service';
import { MethodPaymentService } from '@services/method-payment/method-payment.service';
import { MethodPaymentController } from '@controllers/method-payment/method-payment.controller';
import { LeaseController } from '@controllers/lease/lease.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DateFormatInterceptor } from '@shared/interceptors/date-format.interceptor';
import { BackupController } from '@controllers/backup/backup.controller';
import { BackupService } from '@services/backup/backup.service';
import { MaintenanceService } from '@/services/bill/maintenance.service';
import { ReportsService } from '@services/reports/reports.service';
import { ReportsController } from '@controllers/reports/reports.controller';
import { FormatDateService } from '@shared/services/format-date/format-date.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaService } from './libs/prisma.service';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 2000,
      max: 1000,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api/(.*)', '/api-docs'],
      serveStaticOptions: {
        cacheControl: true,
      },
    }),
  ],
  controllers: [
    AppController,
    TenantController,
    ApartmentController,
    PaymentController,
    MaintenanceController,
    MethodPaymentController,
    LeaseController,
    BackupController,
    ReportsController,
  ],
  providers: [
    AppService,
    TenantService,
    ApartmentService,
    PaymentService,
    LeaseService,
    MethodPaymentService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DateFormatInterceptor,
    },
    BackupService,
    MaintenanceService,
    ReportsService,
    FormatDateService,
    PrismaService,
  ],
})
export class AppModule {}
