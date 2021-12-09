import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { verifyMessage } from '@pastoapp/astroid-keys';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private usersService: UsersService) {}

  async validateUser(uid: string, signature: string): Promise<User> {
    this.logger.debug(
      `Attempting to verify ${uid} with signature ${signature}`,
    );
    const { result: user } = await this.usersService.findOne(uid);

    if (!user) return null;

    const result = await verifyMessage(user.nonce, signature, user.publicKey);

    // await this.usersService.update(uid, {
    //   files: user.files, // TODO: refactor, redundant operation
    // });

    return result ? user : null;
  }
}
