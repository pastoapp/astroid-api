import { Injectable } from '@nestjs/common';
import { create } from 'ipfs-http-client';
import { DbManager } from './lib/db-manager';
import { OrbitDbApi } from './lib/orbitdb-api';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const OrbitDb = require('orbit-db');

export interface ApiConfig {
  ipfsHost: string;
  ipfsPort: number;
  orbitDbDirectory: string;
  orbitDbOptions?: any;
  serverOptions?: any;
}

@Injectable()
export class IpfsApiService {
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

    const dbm = new DbManager(orbitdb);

    return new OrbitDbApi(dbm, serverOptions);
  }
}
