import { Logger } from '@nestjs/common';
import IPFS from 'ipfs';
import { ApiConfig } from './interfaces/api-config.interface';
import { DbManager } from '../ipfs-api/lib/db-manager';
import { OrbitDbApi } from '../ipfs-api/lib/orbitdb-api';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const OrbitDb = require('orbit-db');

export class AstroidOrbitDB {
  private readonly logger = new Logger(AstroidOrbitDB.name);
  static API: Promise<OrbitDbApi>;

  constructor(config: ApiConfig) {
    // AstroidOrbitDB.API = this.apiFactory(config);
    AstroidOrbitDB.API = this.localNode(config);
  }

  private async localNode({ orbitDbOptions, serverOptions }: ApiConfig) {
    const ipfs = IPFS.create();

    const orbitdb = await OrbitDb.createinstance(ipfs, {
      ...orbitDbOptions,
      orbitDbDirectory: '/data/orbitdb',
    });
    const dbm = new DbManager(orbitdb);
    return new OrbitDbApi(dbm, serverOptions);
  }

  private async apiFactory({
    ipfsHost,
    ipfsPort,
    orbitDbDirectory,
    orbitDbOptions,
    serverOptions,
  }: ApiConfig) {
    const ipfs = IPFS.create({
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
