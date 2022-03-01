import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { v4 as uuid } from "uuid";
import { randomBytes } from "crypto";
import { User } from "./entities/user.entity";
import { OrbitDbService } from "../orbitdb/orbitdb.service";
import DocumentStore from "orbit-db-docstore";

@Injectable()
export class UsersService
  implements OnApplicationBootstrap, OnApplicationShutdown {
  userStore: DocumentStore<User>;
  constructor(
    private readonly orbitdbService: OrbitDbService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async onApplicationBootstrap() {
    this.userStore = (await this.orbitdbService.getStore<User>(
      "users"
    )) as DocumentStore<User>;
  }

  async onApplicationShutdown(signal?: string) {
    this.userStore?.close();
  }

  async create(createUserDto: CreateUserDto) {
    const user: User = {
      _id: uuid(),
      nonce: randomBytes(16).toString("base64"),
      publicKey: createUserDto.publicKey,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAdmin: false,
    };

    return {
      _id: user._id,
      hash: await this.userStore.put({ _id: user._id, ...user }),
    };
  }

  async findAll(): Promise<User[]> {
    const result = (await this.orbitdbService.getStore<User>(
      "users"
    )) as DocumentStore<User>;

    const users = result.query((doc) => doc);

    result.close();

    return users;
  }

  // async findOne(id: string): Promise<User> {
  //   const { result } = await this.databaseService.getItemFromKeyValue<User>(
  //     `users`,
  //     id,
  //   );
  //   return result;
  // }

  // TODO: think about implementing it
  // TODO: untested!
  // async update(id: string, updateUserDto: UpdateUserDto): Promise<string> {
  //   const { result } = await this.databaseService.getItemFromKeyValue<User>(
  //     'users',
  //     id,
  //   );
  //   return await this.databaseService.updateItemFromKeyValue('users', {
  //     key: id,
  //     value: {
  //       ...result,
  //       ...updateUserDto,
  //       // nonce: randomBytes(16).toString('base64'), // TODO: reenable when publickey auth works
  //     },
  //   });
  // }

  // /**
  //  * Removes a user from the database
  //  * @param id user id
  //  * @returns confirmation hash
  //  */
  // async remove(id: string) {
  //   return await this.databaseService.deleteItemFromKeyValue('users', id);
  // }
}
