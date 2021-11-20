import { CacheModule, Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts as RedisClientOpts } from 'redis';

@Module({
  imports: [
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
