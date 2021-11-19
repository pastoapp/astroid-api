export class DbManager {
  constructor(private orbitdb: any) {}

  identity = this.orbitdb.identity;

  getOrbitDb() {
    return this.orbitdb;
  }

  test() {
    return 'Hello from db-manager';
  }
}
