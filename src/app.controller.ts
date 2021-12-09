import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    // new IpfsApiService(defaultConfig);
  }

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/get')
  async getKeys(@Query() query): Promise<string> {
    const { key } = query;
    return await this.appService.getKey(key);
  }
}
