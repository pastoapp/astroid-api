import {
  CACHE_MANAGER,
  INestApplication,
  Inject,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { ApiConfig } from "./interfaces/api-config.interface";
import OrbitDB from "orbit-db";
import { existsSync, mkdirSync } from "fs";
import { Cache } from "cache-manager";
import Store from "orbit-db-store";
import DocumentStore from "orbit-db-docstore";

/**
 * Intial store interface
 */
export interface InitialStore {
  name: string;
  storeType: DbType;
  storeOptions?: any;
}

/**
 * Available Database types.
 */
export type DbType = "eventlog" | "feed" | "docstore" | "keyvalue" | "counter";

/**
 * Default config to start the application, {@link OrbitDbService}.
 */
export const defaultConfig: ApiConfig = {
  ipfsHost: "localhost",
  ipfsPort: 5001,
  orbitDbDirectory: "/orbitdb",
  orbitDbOptions: {},
  serverOptions: {},
};

/**
 * OrbitDbService starts with the application. It is a wrapper around the OrbitDB. It uses
 * the {@link DocumentStore} as a default store.
 */
export class OrbitDbService implements OnModuleInit {
  // Logger
  private readonly logger = new Logger(OrbitDbService.name);

  // Config Attribute
  private config: ApiConfig;

  // OrbitDb Library Object
  private OrbitDb = require("orbit-db");

  // main API object
  public static API: OrbitDB;

  // main IPFS object
  private ipfs: IPFSHTTPClient;

  /**
   * Creates a new instance of the OrbitDbService. It is intended as a singleton.
   * @param cacheManager applied cache manager. Currently {@link CacheManagerModule} is used in concatination with redis.
   */
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    // TODO: add config to constructor
    const config = defaultConfig;

    // making sure that the orbitdb directory exists
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

  /**
   * Initialises the OrbitDB.
   * @param config {@link ApiConfig}} configuration object to start the orbitdb service.
   * @returns an initialized OrbitDB instance.
   */
  private async initOrbitDb({
    orbitDbOptions,
    orbitDbDirectory,
  }: ApiConfig): Promise<OrbitDB> {
    const orbitdb = await this.OrbitDb.createInstance(this.ipfs, {
      ...orbitDbOptions,
      directory: orbitDbDirectory || "/orbitdb",
    });

    this.logger.log(`PeerID: ${orbitdb.id}`);

    return orbitdb as OrbitDB;
  }

  /**
   * Creates a new store.
   * @param param0 {@link InitialStore} object to create a new, initial store.
   * @returns an initialized store with name.
   */
  async createStore<T = unknown>({
    name,
    storeType,
    storeOptions,
  }: InitialStore) {
    const defaultStoreOptions = {
      accessController: {
        write: [
          // Give access to ourselves
          // OrbitDbService.API.identity.id,
          "*",
          // TODO: Give access to the another peer
        ],
      },
      overwrite: true,
      replicate: true,
    };

    const store = await OrbitDbService.API.docs<T>(name, {
      ...storeOptions,
      ...defaultStoreOptions,
    });

    this.cacheManager.set(name, `${store.address}`);

    return {
      name,
      store,
    };
  }

  /**
   * Request a certain store with a given name.
   * @param name the name of the store.
   * @returns a store with the given name.
   */
  async getStore<T = Store>(name: string): Promise<DocumentStore<T> | Store> {
    const address: string = await this.cacheManager.get<string>(name);

    if (name === "users" || name === "messages") {
      const store = await OrbitDbService.API.docs<T>(address);
      await store.load();
      return store;
    }
    if (address) {
      return OrbitDbService.API.open(address);
    }
    throw new Error(`No database with ${name} found`);
  }

  /**
   * Populates the OrbitDB with the given, default stores.
   * @param initalStores {@link InitialStore} array of stores to create.
   * @returns all initialised stores.
   */
  async populateOrbitDb(initalStores: InitialStore[]) {
    return Promise.all(initalStores.map((store) => this.createStore(store)));
  }

  //Code that runs when the module is initialized.
  async onModuleInit() {
    // Make sure, that on initialization of this module, only one, static instance of the API is going to be created.
    // aka. singleton
    if (!OrbitDbService.API) {
      OrbitDbService.API = await this.initOrbitDb(this.config);
      this.logger.log("Intialised OrbitDB");
      this.logger.log("Populating Astroid API...");

      // default stores
      const initialStores: InitialStore[] = [
        {
          name: "users",
          storeType: "docstore",
        },
        {
          name: "messages",
          storeType: "docstore",
        },
      ];

      const stores = await this.populateOrbitDb(initialStores);
      stores.forEach(({ name, store }) =>
        this.logger.log("Initialised:", name, store.type, store.address)
      );
    }
  }

  async enableShutDownHooks(app: INestApplication) {
    await app.close();
  }
}
