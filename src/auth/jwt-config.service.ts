import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService {
    constructor(private readonly configService: ConfigService) {}

    createJwtOptions(): JwtModuleOptions {
        return {
            secret: this.configService.get<string>(
                'JWT_TOKEN_SECRET',
                'C79196F6B1B847C5B2FF6C3E4C7E2D985CF9776F1247092037A77DFA270FB2B6',
            ),
            signOptions: {
                expiresIn: '1h',
            },
        };
    }
}
