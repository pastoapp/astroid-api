import { INestApplication, Logger, OnModuleInit } from '@nestjs/common';
import { create } from 'ipfs-http-client';
import { ApiConfig } from '../orbitdb/interfaces/api-config.interface';
import { DbManager } from '../orbitdb/lib/db-manager';
import { OrbitDbApi } from '../orbitdb/lib/orbitdb-api';

export const defaultConfig: ApiConfig = {
  ipfsHost: 'localhost',
  ipfsPort: 5001,
  orbitDbDirectory: '/data/orbitdb',
  orbitDbOptions: {},
  serverOptions: {},
};

export class OrbitDbService implements OnModuleInit {
  private readonly logger = new Logger(OrbitDbService.name);

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
    if (!OrbitDbService.API) {
      OrbitDbService.API = this.apiFactory(defaultConfig);
      console.log(await OrbitDbService.API);
    }
  }

  async enableShutDownHooks(app: INestApplication) {
    // this.$on('beforeExit', async () => {
    await app.close();
    // });
  }
}
