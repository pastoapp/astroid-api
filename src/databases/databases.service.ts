import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { remove as ldremove } from 'lodash';
import { DbType, OrbitDbService } from '../orbitdb/orbitdb.service';
import KeyValueStore from 'orbit-db-kvstore';

@Injectable()
export class DatabasesService {
  private readonly logger = new Logger(DatabasesService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private orbitdb: OrbitDbService,
  ) {}

  /**
   * Helper function, which returns an open store
   * @param id database ID
   * @param openOptions opening options for the Orbitdb.open function
   * @returns Store-Object from the opened OrbitDB + address
   */
  async getStoreFromID(id: string, openOptions?: IOpenOptions) {
    const cacheData: {
      data: {
        root: string;
        path: string;
      };
    } = await this.cacheManager.get(`db_${id}`);

    const address = `/orbitdb/${cacheData.data.root}/${cacheData.data.path}`;
    const store = await OrbitDbService.API.open(address, openOptions);

    return {
      store,
      address,
    };
  }

  /**
   * Create an OrbitDB entry.
   *
   * @param createDatabaseDto database creation params
   * @param id database name
   * @returns data, with what the database was generated
   */
  async create(createDatabaseDto: CreateDatabaseDto) {
    const { dbName: id } = createDatabaseDto;
    // disallow the global variable of all DBs
    if (id === 'db_all') throw new Error('Forbidden DB name');
    if (await this.cacheManager.get(id))
      throw new Error('Database does already exist');

    // prefix db names
    const dbName = `db_${id}`;

    // create DB in OrbitDB
    const api = OrbitDbService.API;
    const { type: dbType } = createDatabaseDto;
    const store = await api.create(dbName, dbType);
    this.logger.log(`Created ${dbName}`);

    // cache store
    await this.cacheManager.set(
      dbName,
      { data: store.address, type: store.type },
      { ttl: 0 },
    );
    // cache db name
    const dbs = ((await this.cacheManager.get('db_all')) as string[]) || [];

    // update global DB names (the cache manager is not able to handle regular expressions)
    await this.cacheManager.set('db_all', [...dbs, dbName]);
    const { data } = await this.cacheManager.get(dbName);

    return { data, store: store.identity };
  }

  /**
   * Request all saved databases.
   *
   * @returns all databases
   */
  async findAll() {
    const data: string[] = await this.cacheManager.get('db_all');
    const results = await Promise.all(
      data.map(async (dbname) => {
        const { data } = await this.cacheManager.get(dbname);
        // TODO: Fix, as soon as I resetted the IPFS store and Redis
        // if (!data.root) return;
        // const { root, path } = data;
        // return `/orbitdb/${root}/${path}`;
        return { id: dbname, data };
      }),
    );
    return {
      data: results,
    };
  }

  /**
   * OrbitDB information for a certain database.
   *
   * @param id database id
   * @returns database info (currently, address + identity)
   */
  async findOne(id: string) {
    this.logger.log(`opening DB ${id}`);
    const { address, store } = await this.getStoreFromID(id);
    await store.load();
    this.logger.log(`Loaded db ${id}`);
    return {
      address,
      store: store.identity,
    };
  }

  /**
   * Update a certain OrbitDB entry
   *  TODO: think about implementing this with ODB
   * @param id database id
   * @param updateDatabaseDto update parameters
   * @returns the newly updated database entry
   */
  async update(id: string, updateDatabaseDto: UpdateDatabaseDto) {
    const dbName = `db_${id}`;
    const dbInfo = this.cacheManager.get(dbName);

    // check, if db is present
    if (!dbInfo) throw new Error('Database not known');

    return await this.cacheManager.set(dbName, {
      ...dbInfo,
      ...updateDatabaseDto,
    });
  }

  /**
   * Remove a certain Orbitdb from the gateway-registrar.
   * Deletes the local database `id`. This does not delete any data from peers. Uses a similar implementation as `orbitdb/orbit-db-http-api`.
   * @param id database id
   * @returns success status
   */
  async remove(id: string) {
    // stop current api connection
    await OrbitDbService.API.stop();

    // remove from global db registrar
    const all: string[] = await this.cacheManager.get('db_all');
    ldremove(all, (dbn: string) => `db_${id}` === dbn);
    this.cacheManager.set('db_all', all);

    this.logger.log(`unloaded db_${id}`);

    // remove from cache
    return await this.cacheManager.del(`db_${id}`);
  }

  async removeItem(id: string, item: number | string) {
    const { store } = await this.getStoreFromID(id);
    console.log(store.all);
  }

  async getKeyValueStore<T = string>(id: string): Promise<KeyValueStore<T>> {
    const { store } = await this.getStoreFromID(id);
    if ((store.type as DbType) !== 'keyvalue')
      throw new Error('Invalid Store Type. Must be "keyvalue"');
    return store as KeyValueStore<T>;
  }

  async addItemToKeyValue<T = string>(
    id: string,
    { key, value }: { key: string; value: T },
  ) {
    const kvStore = await this.getKeyValueStore<T>(id);
    await kvStore.load();
    const hash = await kvStore.put(key, value);
    await kvStore.close();
    return { hash };
  }

  async getItemFromKeyValue<T = string>(
    id: string,
    key: string,
  ): Promise<{ result: T }> {
    const kvStore = await this.getKeyValueStore<T>(id);
    await kvStore.load();
    const result = kvStore.get(key);
    await kvStore.close();
    return { result: result ?? null };
  }

  async getAllItemsFromKeyValue<T = string>(id: string) {
    const kvStore = await this.getKeyValueStore<T>(id);
    await kvStore.load();
    const result = kvStore.all;
    await kvStore.close();
    return result ?? null;
  }

  async deleteItemFromKeyValue<T = string>(id: string, key: string) {
    const kvStore = await this.getKeyValueStore<T>(id);
    await kvStore.load();
    const result = await kvStore.del(key);
    await kvStore.close();
    return result;
  }

  async updateItemFromKeyValue<T = string>(
    id: string,
    { key, value }: { key: string; value: T },
  ): Promise<string> {
    const kvStore = await this.getKeyValueStore<T>(id);
    await kvStore.load();
    const result = await kvStore.put(key, value);
    await kvStore.close();
    return result;
  }
}
