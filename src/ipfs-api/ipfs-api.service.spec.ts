import { Test, TestingModule } from '@nestjs/testing';
import { IpfsApiService } from './ipfs-api.service';

describe('IpfsApiService', () => {
  let service: IpfsApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IpfsApiService],
    }).compile();

    service = module.get<IpfsApiService>(IpfsApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
