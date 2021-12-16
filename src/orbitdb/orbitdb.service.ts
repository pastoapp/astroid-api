import { INestApplication, Logger, OnModuleInit } from '@nestjs/common';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { ApiConfig } from './interfaces/api-config.interface';
import OrbitDB from 'orbit-db';
import { existsSync, mkdirSync } from 'fs';

export const defaultConfig: ApiConfig = {
  ipfsHost: 'localhost',
  ipfsPort: 5001,
  orbitDbDirectory: '/orbitdb',
  orbitDbOptions: {},
  serverOptions: {},
};

export class OrbitDbService implements OnModuleInit {
  private readonly logger = new Logger(OrbitDbService.name);
  private config: ApiConfig;

  private OrbitDb = require('orbit-db');

  public static API: OrbitDB;

  private ipfs: IPFSHTTPClient;

  constructor(config = defaultConfig) {
    // make sure that the orbitdb directory exists
    this.config = { ...defaultConfig, ...config };
    if (!existsSync(config.orbitDbDirectory)) {
      if (!config.orbitDbDirectory) {
        mkdirSync(defaultConfig.orbitDbDirectory);
      }
      mkdirSync(config.orbitDbDirectory);
    }

    this.ipfs = create({
      host: config.ipfsHost,
      port: config.ipfsPort,
    });
  }

  private async initOrbitDb({
    orbitDbOptions,
    orbitDbDirectory,
  }: ApiConfig): Promise<OrbitDB> {
    const orbitdb = await this.OrbitDb.createInstance(this.ipfs, {
      ...orbitDbOptions,
      directory: orbitDbDirectory || '/orbitdb',
    });

    this.logger.log(`PeerID: ${orbitdb.id}`);

    return orbitdb as OrbitDB;
  }

  async createStore({ name, storeType, storeOptions }: InitialStore) {
    const defaultStoreOptions = {
      accessController: {
        write: [
          // Give access to ourselves
          OrbitDbService.API.identity.id,
          // TODO: Give access to the another peer
        ],
      },
      overwrite: true,
      replicate: true,
    };

    const store = await OrbitDbService.API.create(name, storeType, {
      ...storeOptions,
      ...defaultStoreOptions,
    });

    // TODO: Add to cache
    // name, store.address

    return {
      name,
      store,
    };
  }

  async populateOrbitDb(initalStores: InitialStore[]) {
    return Promise.all(initalStores.map((store) => this.createStore(store)));
  }

  async onModuleInit() {
    // Make sure, that on initialization of this module, only one, static instance of the API is going to be created.
    // aka. singleton
    if (!OrbitDbService.API) {
      OrbitDbService.API = await this.initOrbitDb(this.config);
      this.logger.log('Intialised OrbitDB');
      this.logger.log('Populating Astroid API...');

      const initialStores: InitialStore[] = [
        {
          name: 'users',
          storeType: 'keyvalue',
        },
        {
          name: 'messages',
          storeType: 'docstore',
        },
      ];

      const stores = await this.populateOrbitDb(initialStores);
      stores.forEach(({ name, store }) =>
        this.logger.log('Initialised:', name, store.type, store.address),
      );
    }
  }

  async enableShutDownHooks(app: INestApplication) {
    await app.close();
  }
}

export type DbType = 'eventlog' | 'feed' | 'docstore' | 'keyvalue' | 'counter';

export interface InitialStore {
  name: string;
  storeType: DbType;
  storeOptions?: any;
}
