import {
    Controller,
    Get,
    Query,
    Logger,
    Post,
    UseGuards,
    Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Public } from './auth/meta';
import { User } from './users/entities/user.entity';

export type JwtUserRequest = Request & { user: { uid: string } };

@Controller()
export class AppController {
    private readonly logger = new Logger(AppController.name);

    constructor(
        private readonly appService: AppService,
        private authService: AuthService,
    ) {}

    @Get('/')
    index(): string {
        return this.appService.landingPage();
    }

    @Get('/get')
    async getKeys(@Query() query): Promise<string> {
        const { key } = query;
        return await this.appService.getKey(key);
    }

    @UseGuards(LocalAuthGuard)
    @Public()
    @Post('/auth/login')
    async login(@Req() req) {
        this.logger.debug('login is called');
        const user: User = req.user;

        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/auth/profile')
    getProfile(@Req() req: JwtUserRequest) {
        return req.user;
    }
}
