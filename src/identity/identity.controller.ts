import { Controller, Get } from '@nestjs/common';
import { ApiConfig, IpfsApiService } from '../ipfs-api/ipfs-api.service';

@Controller('identity')
export class IdentityController {
  settings: ApiConfig = {
    ipfsHost: 'localhost',
    ipfsPort: 5001,
    orbitDbDirectory: '../orbit-db',
    orbitDbOptions: {},
    serverOptions: {},
  };

  constructor(private ipfsApiService: IpfsApiService) {}

  @Get()
  async sendIdentity() {
    const factory = await this.ipfsApiService.apiFactory(this.settings);
    return factory.identity();
  }
}
