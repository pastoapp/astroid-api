import { DbManager } from './db-manager';

export class OrbitDbApi {
  dbm: any;

  // TODO: #2 implement server options
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(dbm: DbManager, _serverOptions: any) {
    this.dbm = dbm;
  }

  identity() {
    return this.dbm.identity;
  }

  test() {
    return 'Hello from orbitdb-api';
  }
}
