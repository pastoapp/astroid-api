import { Module } from '@nestjs/common';
import { OrbitDbService } from './orbitdb.service';

@Module({
  providers: [OrbitDbService],
  exports: [OrbitDbService], // make OrbitDB Service available to other modules
})
export class OrbitdbModule {}
