export class DbManager {
  constructor(private orbitdb: any) {}

  identity = this.orbitdb.identity;

  test() {
    return 'Hello from db-manager';
  }
}
