import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { OrbitDbService } from './orbitdb.service';

describe('OrbitDbService', () => {
  let service: OrbitDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [OrbitDbService],
    }).compile();

    service = module.get<OrbitDbService>(OrbitDbService);
    await service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have an initialised store instance', async () => {
    const { store, name } = await service.createStore({
      name: 'testing',
      storeType: 'docstore',
    });
    expect(name).toBeTruthy();
    expect(store.identity.id).toBeDefined();
  });
});
