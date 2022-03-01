import { Test, TestingModule } from '@nestjs/testing';
import { OrbitdbModule } from '../orbitdb/orbitdb.module';
import { AppModule } from '../app.module';
import { UsersService } from './users.service';
import { OrbitDbService } from '../orbitdb/orbitdb.service';
import { jest } from '@jest/globals';

jest.setTimeout(10 * 1000);

describe('UsersService', () => {
  let service: UsersService;
  let db: OrbitDbService;
  const publicKey =
    '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1vtJdYTUHiBzUL/XxJTV\nSCybPO976tC0GDU0A+fjHfZZPV5r6UKEMDDeTq0Eta5gsV0eYJdcOlhJYLBAtSWk\nKCRQ+rsqDlaJwgo+6KM7+bFI66c5EXa1nyNGCeHJtFSvAtsmYBPbjETbxX50a78Q\nUQQ/3CpQ9fQtxIdoIyVXseZOsd1IRpjADouWOxYen/YWWhNXI2y5/17srv3wL99K\nfhFKcclMPWzBk0mlXkD1ICQ5Vm50Nu77mjWY/eGTCcbJ6oMWeu3vatL9p6oM3m9V\nXZPXc+MaBDEipJ3mXEQfe/zeXZxm9l5AaiANhTNOQAHMgCQ+j82NXDZNW0i0sM3f\n1wIDAQAB\n-----END PUBLIC KEY-----\n';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OrbitdbModule, AppModule],
      providers: [UsersService, OrbitDbService],
    }).compile();

    db = module.get<OrbitDbService>(OrbitDbService);
    await db.onModuleInit();

    service = module.get<UsersService>(UsersService);
    await service.onApplicationBootstrap();
  });

  afterEach(async () => {
    await service.onApplicationShutdown();
    await OrbitDbService.API.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have an initialised userStore instance', () => {
    const userService = service.userStore;
    expect(userService).toBeDefined();
  });

  it('should create user with public key', async () => {
    const { _id, hash } = await service.create({ publicKey });
    expect(_id).toBeDefined();
    expect(hash).toBeDefined();
  });
});
