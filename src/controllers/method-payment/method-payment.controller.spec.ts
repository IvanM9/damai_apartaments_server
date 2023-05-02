import { Test, TestingModule } from '@nestjs/testing';
import { MethodPaymentController } from './method-payment.controller';

describe('MethodPaymentController', () => {
  let controller: MethodPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MethodPaymentController],
    }).compile();

    controller = module.get<MethodPaymentController>(MethodPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
