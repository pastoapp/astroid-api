import OrbitDB from 'orbit-db';
import { DbManager } from './db-manager';

export class OrbitDbApi {
  dbs: any = {};
  dbm: DbManager;
  orbitdb: OrbitDB;

  // TODO: #2 implement server options
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(dbm: DbManager, _serverOptions: any) {
    this.dbm = dbm;
    this.orbitdb = dbm.getOrbitDb();
  }
}
