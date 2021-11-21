import { CacheModule, Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts as RedisClientOpts } from 'redis';
import { OrbitdbModule } from 'src/orbitdb/orbitdb.module';

@Module({
  imports: [
    OrbitdbModule,
    CacheModule.register<RedisClientOpts>({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 0,
    }),
  ],
  controllers: [DatabasesController],
  providers: [DatabasesService],
})
export class DatabasesModule {}
