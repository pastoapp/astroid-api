export class CreateDatabaseDto {
  dbName: string;
  create: boolean;
  type: DbTypes;
  override?: boolean;
  // TODO: #3 Add access controllers
  // https://github.com/orbitdb/orbit-db-http-api#post-dbdbname
  // add indexBy key
}

export type DbTypes = 'eventlog' | 'feed' | 'docstore' | 'keyvalue' | 'counter';
