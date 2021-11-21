import { ApiConfig } from '../orbit-db/interfaces/api-config.interface';

// TODO: #5 implement env vars
// default API settings for the IPFS node
export const defaultConfig: ApiConfig = {
  ipfsHost: process.env.IPFS_HOST || 'localhost',
  ipfsPort: 5001,
  orbitDbDirectory: process.env.ORBITDB_LOCATION || '../orbit-db',
  orbitDbOptions: {},
  serverOptions: {},
};
