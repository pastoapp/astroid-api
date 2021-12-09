import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateDatabaseDto {
  @IsNotEmpty()
  @IsString()
  dbName: string;

  @IsBoolean()
  create: boolean;

  @IsNotEmpty()
  @ValidateIf((o: CreateDatabaseDto) => o.type === 'keyvalue')
  type: DbTypes;

  override?: boolean;
  // TODO: #3 Add access controllers
  // https://github.com/orbitdb/orbit-db-http-api#post-dbdbname
  // add indexBy key
}

export type DbTypes = 'eventlog' | 'feed' | 'docstore' | 'keyvalue' | 'counter';
