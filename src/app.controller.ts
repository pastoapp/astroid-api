import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
// import { defaultConfig } from './ipfs-api/config';
// import { IpfsApiService } from './ipfs-api/ipfs-api.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    // new IpfsApiService(defaultConfig);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
