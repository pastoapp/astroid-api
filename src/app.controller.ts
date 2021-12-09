import {
  Controller,
  Request,
  Get,
  Post,
  Query,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/get')
  async getKeys(@Query() query): Promise<string> {
    const { key } = query;
    return await this.appService.getKey(key);
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    this.logger.debug('login is called');
    return req.user;
  }
}
