import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentEntity } from './Models/apartment.entity';
import { BankEntity } from './Models/bank.entity';
import { LeaseEntity } from './Models/lease.entity';
import { MaintenanceEntity } from './Models/maintenance.entity';
import { MethodPaymentEntity } from './Models/method-payment.entity';
import { PaymentEntity } from './Models/payment.entity';
import { TenantEntity } from './Models/tenant.entity';
import { BankController } from './controllers/bank/bank.controller';
import { MaintenanceController } from './controllers/maintenance/maintenance.controller';
import { TenantService } from './services/tenant/tenant.service';
import { ApartmentService } from './services/apartment/apartment.service';
import { PaymentService } from './services/payment/payment.service';
import { TenantController } from './controllers/tenant/tenant.controller';
import { ApartmentController } from './controllers/apartment/apartment.controller';
import { PaymentController } from './controllers/payment/payment.controller';
import { TenantRepository } from './services/tenant/tenant.repository';
import { ApartmentRepository } from './services/apartment/apartment.repository';
import { LeaseService } from './services/lease/lease.service';
import { MethodPaymentService } from './services/method-payment/method-payment.service';
import { BankService } from './services/bank/bank.service';
import { PaymentRepository } from './services/payment/payment.repository';
import { BankRepository } from './services/bank/bank.repository';
import { MethodPaymentRepository } from './services/method-payment/method-payment.repository';
import { MethodPaymentController } from './controllers/method-payment/method-payment.controller';
import { LeaseRepository } from './services/lease/lease.repository';
import { LeaseController } from './controllers/lease/lease.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DateFormatInterceptor } from './shared/interceptors/date-format.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'damai.sqlite',
      entities: [
        ApartmentEntity,
        BankEntity,
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
  ],
  controllers: [
    AppController,
    TenantController,
    ApartmentController,
    PaymentController,
    BankController,
    MaintenanceController,
    MethodPaymentController,
    LeaseController,
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
    BankService,
    PaymentRepository,
    BankRepository,
    MethodPaymentRepository,
    LeaseRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: DateFormatInterceptor,
    },
  ],
})
export class AppModule {}
