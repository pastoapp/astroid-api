import { Logger, Injectable } from '@nestjs/common';
import { create } from 'ipfs-http-client';
import { ApiConfig } from './interfaces/api-config.interface';
import { DbManager } from './lib/db-manager';
import { OrbitDbApi } from './lib/orbitdb-api';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const OrbitDb = require('orbit-db');

@Injectable()
export class IpfsApiService {
  private readonly logger = new Logger(IpfsApiService.name);

  async apiFactory({
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
