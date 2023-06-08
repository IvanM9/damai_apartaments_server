import { Test, TestingModule } from '@nestjs/testing';
import { FormatDateService } from './format-date.service';

describe('FormatDateService', () => {
  let service: FormatDateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormatDateService],
    }).compile();

    service = module.get<FormatDateService>(FormatDateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
