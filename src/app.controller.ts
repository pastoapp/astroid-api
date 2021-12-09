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
import { User } from './users/entities/user.entity';
import { LocalAuthGuard } from './auth/local-auth.guard';

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

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    this.logger.debug('login is called');
    const user: User = req.user;

    return {
      id: user.id,
      files: user.files,
      publicKey: user.publicKey, // TODO: redundant?
    };
  }
}
