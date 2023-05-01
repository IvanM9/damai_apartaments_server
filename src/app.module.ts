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
      cache: true,
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
  ],
  providers: [
    AppService,
    TenantService,
    ApartmentService,
    PaymentService,
    TenantRepository,
  ],
})
export class AppModule {}
