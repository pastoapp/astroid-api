import { Logger, Injectable } from '@nestjs/common';
import { create } from 'ipfs-http-client';
import { ApiConfig } from '../orbit-db/interfaces/api-config.interface';
import { DbManager } from './lib/db-manager';
import { OrbitDbApi } from './lib/orbitdb-api';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const OrbitDb = require('orbit-db');

@Injectable()
export class IpfsApiService {
  private readonly logger = new Logger(IpfsApiService.name);
  static API: Promise<OrbitDbApi>;

  constructor(config: ApiConfig) {
    IpfsApiService.API = this.apiFactory(config);
  }

  private async apiFactory({
    ipfsHost,
    ipfsPort,
    orbitDbDirectory,
    orbitDbOptions,
    serverOptions,
  }: ApiConfig) {
    const ipfs = create({
      host: ipfsHost,
      port: ipfsPort,
    });

    const orbitdb = await OrbitDb.createInstance(ipfs, {
      ...orbitDbOptions,
      directory: orbitDbDirectory, // TODO: #1 Change `/orbitdb` to default orbitdb directory
    });

    this.logger.log(`PeerID: ${orbitdb.id}`);

    const dbm = new DbManager(orbitdb);

    return new OrbitDbApi(dbm, serverOptions);
  }
}
