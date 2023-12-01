import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentEntity } from '@models/apartment.entity';
import { LeaseEntity } from '@models/lease.entity';
import { MaintenanceEntity } from '@models/maintenance.entity';
import { MethodPaymentEntity } from '@models/method-payment.entity';
import { PaymentEntity } from '@models/payment.entity';
import { TenantEntity } from '@models/tenant.entity';
import { MaintenanceController } from '@controllers/maintenance/maintenance.controller';
import { TenantService } from '@services/tenant/tenant.service';
import { ApartmentService } from '@services/apartment/apartment.service';
import { PaymentService } from '@services/payment/payment.service';
import { TenantController } from '@controllers/tenant/tenant.controller';
import { ApartmentController } from '@controllers/apartment/apartment.controller';
import { PaymentController } from '@controllers/payment/payment.controller';
import { TenantRepository } from '@services/tenant/tenant.repository';
import { ApartmentRepository } from '@services/apartment/apartment.repository';
import { LeaseService } from '@services/lease/lease.service';
import { MethodPaymentService } from '@services/method-payment/method-payment.service';
import { PaymentRepository } from '@services/payment/payment.repository';
import { MethodPaymentRepository } from '@services/method-payment/method-payment.repository';
import { MethodPaymentController } from '@controllers/method-payment/method-payment.controller';
import { LeaseRepository } from '@services/lease/lease.repository';
import { LeaseController } from '@controllers/lease/lease.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DateFormatInterceptor } from '@shared/interceptors/date-format.interceptor';
import { BackupController } from '@controllers/backup/backup.controller';
import { BackupService } from '@services/backup/backup.service';
import { MaintenanceService } from '@services/maintenance/maintenance.service';
import { MaintenanceRepository } from '@services/maintenance/maintenance.repository';
import { ReportsService } from '@services/reports/reports.service';
import { ReportsController } from '@controllers/reports/reports.controller';
import { FormatDateService } from '@shared/services/format-date/format-date.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db/damai.sqlite',
      entities: [
        ApartmentEntity,
        LeaseEntity,
        MaintenanceEntity,
        MethodPaymentEntity,
        PaymentEntity,
        TenantEntity,
      ],
      synchronize: true,
      logging: ['error', 'warn'],
      cache: {
        duration: 300000,
        alwaysEnabled: true,
      },
      retryAttempts: 5,
    }),
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
    TenantRepository,
    ApartmentRepository,
    LeaseService,
    MethodPaymentService,
    PaymentRepository,
    MethodPaymentRepository,
    LeaseRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: DateFormatInterceptor,
    },
    BackupService,
    MaintenanceService,
    MaintenanceRepository,
    ReportsService,
    FormatDateService,
  ],
})
export class AppModule {}
