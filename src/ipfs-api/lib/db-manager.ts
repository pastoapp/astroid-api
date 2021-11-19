export class DbManager {
  constructor(private orbitdb) {}

  id() {
    return this.orbitdb.identity;
  }

  test() {
    return 'Hello from db-manager';
  }
}
