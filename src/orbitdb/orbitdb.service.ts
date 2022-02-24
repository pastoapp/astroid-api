import {
  CACHE_MANAGER,
  INestApplication,
  Inject,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { ApiConfig } from './interfaces/api-config.interface';
import OrbitDB from 'orbit-db';
import { existsSync, mkdirSync } from 'fs';
import { Cache } from 'cache-manager';
import Store from 'orbit-db-store';
import DocumentStore from 'orbit-db-docstore';

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

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    // TODO: add config to constructor
    const config = defaultConfig;
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
          // OrbitDbService.API.identity.id,
          '*',
          // TODO: Give access to the another peer
        ],
      },
      overwrite: true,
      replicate: true,
    };

    const store = await OrbitDbService.API.docs(name, {
      ...storeOptions,
      ...defaultStoreOptions,
    });

    this.cacheManager.set(name, `${store.address}`);

    return {
      name,
      store,
    };
  }

  async getStore<T = Store>(name: string): Promise<DocumentStore<T> | Store> {
    const address: string = await this.cacheManager.get<string>(name);
    if (name === 'users' || name === 'messages') {
      const store = await OrbitDbService.API.docs<T>(address);
      await store.load();
      return store;
    }
    if (address) {
      return OrbitDbService.API.open(address);
    }
    throw new Error(`No database with ${name} found`);
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
          storeType: 'docstore',
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
