import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuid } from 'uuid';
import { randomBytes } from 'crypto';
import { User } from './entities/user.entity';
import { DatabasesService } from 'src/databases/databases.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabasesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user: User = {
      id: uuid(),
      nonce: randomBytes(16).toString('base64'),
      publicKey: createUserDto.publicKey,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAdmin: false,
    };

    return {
      id: user.id,
      ...(await this.databaseService.addItemToKeyValue(`users`, {
        key: user.id,
        value: user,
      })),
    };
  }

  async findAll(): Promise<User[]> {
    const result = await this.databaseService.getAllItemsFromKeyValue<User>(
      'users',
    );
    const users = Object.values(result);
    return users;
  }

  async findOne(id: string): Promise<User> {
    const { result } = await this.databaseService.getItemFromKeyValue<User>(
      `users`,
      id,
    );
    return result;
  }

  // TODO: think about implementing it
  // TODO: untested!
  async update(id: string, updateUserDto: UpdateUserDto): Promise<string> {
    const { result } = await this.databaseService.getItemFromKeyValue<User>(
      'users',
      id,
    );
    return await this.databaseService.updateItemFromKeyValue('users', {
      key: id,
      value: {
        ...result,
        ...updateUserDto,
        // nonce: randomBytes(16).toString('base64'), // TODO: reenable when publickey auth works
      },
    });
  }

  /**
   * Removes a user from the database
   * @param id user id
   * @returns confirmation hash
   */
  async remove(id: string) {
    return await this.databaseService.deleteItemFromKeyValue('users', id);
  }
}
