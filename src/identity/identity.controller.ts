import { Controller, Get } from '@nestjs/common';
import { ApiConfig } from 'src/ipfs-api/interfaces/api-config.interface';
import { OrbitDbApi } from 'src/ipfs-api/lib/orbitdb-api';
import { IpfsApiService } from '../ipfs-api/ipfs-api.service';

@Controller('identity')
export class IdentityController {
  settings: ApiConfig = {
    ipfsHost: 'localhost',
    ipfsPort: 5001,
    orbitDbDirectory: '../orbit-db',
    orbitDbOptions: {},
    serverOptions: {},
  };
  api: Promise<OrbitDbApi>;

  constructor(private ipfsApiService: IpfsApiService) {
    this.api = this.ipfsApiService.apiFactory(this.settings);
  }

  @Get()
  async sendIdentity() {
    const factory = await this.api;
    return factory.identity();
  }
}
