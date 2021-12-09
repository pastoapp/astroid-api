import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super();
    this.logger.debug('creating local strategy');
  }

  // passport publickey callback aka "validate"
  async validate(username: string, password: any): Promise<User> {
    this.logger.debug(`calling validation, ${username} - ${password}`);
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      this.logger.error(`no user found!, ${username} - ${password} | ${user}`);
      throw new UnauthorizedException();
    }
    return user;
  }
}
