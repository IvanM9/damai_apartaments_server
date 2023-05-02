import { Test, TestingModule } from '@nestjs/testing';
import { MethodPaymentService } from './method-payment.service';

describe('MethodPaymentService', () => {
  let service: MethodPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MethodPaymentService],
    }).compile();

    service = module.get<MethodPaymentService>(MethodPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
