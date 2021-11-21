import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { remove as ldremove } from 'lodash';
import { OrbitDbService } from 'src/orbitdb/orbitdb.service';
import OrbitDB from 'orbit-db';

@Injectable()
export class DatabasesService {
  private readonly logger = new Logger(DatabasesService.name);
  private oAPI: OrbitDB;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private _orbitdb: OrbitDbService,
  ) {
    // TODO on moduleinit
    this.oAPI = OrbitDbService.API;
  }

  /**
   * Create an OrbitDB entry.
   *
   * @param createDatabaseDto database creation params
   * @param id database name
   * @returns data, with what the database was generated
   */
  async create(createDatabaseDto: CreateDatabaseDto, id: string) {
    // disallow the global variable of all DBs
    if (id === 'db_all') throw new Error('Forbidden DB name');

    // TODO: deny existing names

    this.logger.log(createDatabaseDto, id);
    // prefix db names
    const dbName = `db_${id}`;
    await this.cacheManager.set(
      dbName,
      { data: createDatabaseDto },
      { ttl: 0 },
    );

    // create DB in OrbitDB
    // this.logger.debug({ id, createDatabaseDto });
    // this.logger.debug({ oAPI: this.oAPI });
    // this.logger.debug({ OrbitDbService: OrbitDbService.API });
    const { type: dbType } = createDatabaseDto;
    OrbitDbService.API.create('db_test', 'feed');
    this.logger.log(`Created ${dbName}`);

    // cache db name
    const dbs = ((await this.cacheManager.get('db_all')) as string[]) || [];

    // update global DB names (the cache manager is not able to handle regular expressions)
    await this.cacheManager.set('db_all', [...dbs, dbName]);
    const data = await this.cacheManager.get(dbName);

    return { data };
  }

  /**
   * Request all saved databases.
   *
   * @returns all databases
   */
  async findAll() {
    const data: string[] = await this.cacheManager.get('db_all');
    // cut off the `db_` prefix
    return { data: data.map((dbname) => dbname.substring(3)) };
  }

  /**
   * OrbitDB information for a certain database.
   *
   * @param id database id
   * @returns database info
   */
  async findOne(id: string) {
    this.logger.log(`opening DB ${id}`);
    const cacheData = await this.cacheManager.get(`db_${id}`);

    // return { data };
  }

  /**
   * Update a certain OrbitDB entry
   *
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
   *
   * @param id database id
   * @returns success status
   */
  async remove(id: string) {
    // remove from global db registrat
    const all: string[] = await this.cacheManager.get('db_all');
    ldremove(all, (dbn: string) => `db_${id}` === dbn);
    this.cacheManager.set('db_all', all);

    // remove from cache
    return await this.cacheManager.del(`db_${id}`);
  }
}
