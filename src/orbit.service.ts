import { INestApplication, Logger, OnModuleInit } from '@nestjs/common';
import { create } from 'ipfs-http-client';
import { ApiConfig } from './ipfs-api/interfaces/api-config.interface';
import { IpfsApiService } from './ipfs-api/ipfs-api.service';
import { DbManager } from './ipfs-api/lib/db-manager';
import { OrbitDbApi } from './ipfs-api/lib/orbitdb-api';

export const defaultConfig: ApiConfig = {
  ipfsHost: 'localhost',
  ipfsPort: 5001,
  orbitDbDirectory: '/data/orbitdb',
  orbitDbOptions: {},
  serverOptions: {},
};

export class OrbitService implements OnModuleInit {
  private readonly logger = new Logger(IpfsApiService.name);

  OrbitDb = require('orbit-db');

  static API: any;

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

    const orbitdb = await this.OrbitDb.createInstance(ipfs, {
      ...orbitDbOptions,
      directory: orbitDbDirectory, // TODO: #1 Change `/orbitdb` to default orbitdb directory
    });

    this.logger.log(`PeerID: ${orbitdb.id}`);

    const dbm = new DbManager(orbitdb);

    return new OrbitDbApi(dbm, serverOptions);
  }

  async onModuleInit() {
    // Make sure, that on initialization of this module, only one, static instance of the API is going to be created.
    if (!OrbitService.API) {
      OrbitService.API = this.apiFactory(defaultConfig);
      console.log(await OrbitService.API);
    }
  }

  async enableShutDownHooks(app: INestApplication) {
    // this.$on('beforeExit', async () => {
    await app.close();
    // });
  }
}
