import { Test, TestingModule } from '@nestjs/testing';
import { OrbitDbService } from './orbit-db.service';

describe('OrbitDbService', () => {
  let service: OrbitDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrbitDbService],
    }).compile();

    service = module.get<OrbitDbService>(OrbitDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
