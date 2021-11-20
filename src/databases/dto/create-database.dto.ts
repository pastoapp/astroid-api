export class CreateDatabaseDto {
  dbName: string;
  create: boolean;
  type: 'eventlog' | 'feed' | 'docstore' | 'keyvalue' | 'counter';
  // TODO: #3 Add access controllers
  // https://github.com/orbitdb/orbit-db-http-api#post-dbdbname
}
