import {
  Controller,
  Get,
  Query,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Public } from './auth/meta';
import { User } from './users/entities/user.entity';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

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
  @Public()
  @Post('/auth/login')
  async login(@Request() req) {
    this.logger.debug('login is called');
    const user: User = req.user;

    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/auth/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
