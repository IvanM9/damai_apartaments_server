import { Test, TestingModule } from '@nestjs/testing';
import { Apartment } from './apartment.repository';

describe('Apartment', () => {
  let provider: Apartment;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Apartment],
    }).compile();

    provider = module.get<Apartment>(Apartment);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
