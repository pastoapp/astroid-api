import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuid } from 'uuid';
import { User } from './entities/user.entity';
import { DatabasesService } from 'src/databases/databases.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabasesService) {}

  async create(createUserDto: CreateUserDto) {
    const user: User = {
      id: uuid(),
      publicKey: createUserDto.publicKey,
      createdAt: new Date(),
      files: [],
      updatedAt: new Date(),
    };

    return {
      id: user.id,
      ...(await this.databaseService.addItemToKeyValue(`users`, {
        key: user.id,
        value: user,
      })),
    };
  }

  async findAll() {
    return await this.databaseService.getAllItemsFromKeyValue('users');
  }

  async findOne(id: string) {
    return await this.databaseService.getItemFromKeyValue(`users`, id);
  }

  // TODO: think about implementing it
  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  // TODO: think about implementing it
  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
