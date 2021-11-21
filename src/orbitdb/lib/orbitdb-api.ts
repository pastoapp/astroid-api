import { Logger } from '@nestjs/common';
import OrbitDB from 'orbit-db';
import Store from 'orbit-db-store';
import { DbManager } from './db-manager';

export class OrbitDbApi {
  private readonly logger = new Logger(OrbitDbApi.name);

  dbs: any = {};
  dbm: DbManager;
  orbitdb: OrbitDB;

  // TODO: #2 implement server options
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(dbm: DbManager, _serverOptions: any) {
    this.dbm = dbm;
    this.orbitdb = dbm.getOrbitDb();
  }

  async identity() {
    // const odb = this.orbitdb as any; // incomplete OrbitDB types
    // return odb.identity;
    return this.orbitdb.identity;
  }

  findDb(dbName: string): Store | null {
    // TODO: https://github.com/orbitdb/orbit-db-http-api/blob/develop/src/lib/db-manager.js#L5-L18 Seriously, this is a mess.
    const result = this.dbs[dbName];
    return result ? result : null;
  }

  async get(dbName: string, params?: IOpenOptions) {
    let db: Store = this.findDb(dbName);

    if (db) return db;

    this.logger.log(`Opening OrbitDB database: ${dbName}`);
    db = await this.orbitdb.open(dbName, params);
    await db.load();

    this.dbs[dbName] = db;

    return db;
  }
}
