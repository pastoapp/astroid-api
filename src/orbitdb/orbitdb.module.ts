import { Global, Module } from '@nestjs/common';
import { OrbitDbService } from './orbitdb.service';

/**
 * OrbitDbModule is a NestJS module that provides OrbitDB functionality.
 */
@Global()
@Module({
  providers: [OrbitDbService],
  exports: [OrbitDbService], // make OrbitDB Service available to other modules
})

// eslint-disable-next-line prettier/prettier
export class OrbitdbModule {}
