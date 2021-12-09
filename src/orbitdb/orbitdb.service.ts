import { INestApplication, Logger, OnModuleInit } from '@nestjs/common';
import { create } from 'ipfs-http-client';
import { DbManager } from './lib/db-manager';
import { OrbitDbApi } from './lib/orbitdb-api';
import { ApiConfig } from './interfaces/api-config.interface';
import OrbitDB from 'orbit-db';

export const defaultConfig: ApiConfig = {
  ipfsHost: 'localhost',
  ipfsPort: 5001,
  // TODO: #6 test, if directory exists
  orbitDbDirectory: '/data/orbitdb',
  orbitDbOptions: {},
  serverOptions: {},
};

export class OrbitDbService implements OnModuleInit {
  private readonly logger = new Logger(OrbitDbService.name);

  OrbitDb = require('orbit-db');

  static API: OrbitDB;
  api: OrbitDB;

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
      directory: orbitDbDirectory || '/orbitdb', // TODO: #1 Change `/orbitdb` to default orbitdb directory
    });

    this.logger.log(`PeerID: ${orbitdb.id}`);

    const dbm = new DbManager(orbitdb);

    return new OrbitDbApi(dbm, serverOptions);
  }

  async onModuleInit() {
    // Make sure, that on initialization of this module, only one, static instance of the API is going to be created.
    if (!OrbitDbService.API) {
      OrbitDbService.API = (
        await this.apiFactory(defaultConfig)
      ).dbm.getOrbitDb();
      this.api = OrbitDbService.API;
      this.logger.log('Intialised OrbitDB');
    }
  }

  async enableShutDownHooks(app: INestApplication) {
    await app.close();
  }
}
