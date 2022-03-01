import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrbitdbModule } from './orbitdb/orbitdb.module';
import { ConfigModule } from '@nestjs/config';
import type { ClientOpts as RedisClientOpts } from 'redis';
import { UsersModule } from './users/users.module';
import * as redisStore from 'cache-manager-redis-store';
import { APP_GUARD } from '@nestjs/core';

export const cacheStore = CacheModule.register<RedisClientOpts>({
  store: redisStore,
  host: 'localhost',
  port: 6379,
  isGlobal: true,
  ttl: 0,
});

@Module({
  imports: [
    // orbitdb module
    OrbitdbModule,
    ConfigModule.forRoot({
      // load .env file
      envFilePath: [
        '.env',
        '.env.production',
        '.env.development',
        '.env.test',
        '.env.local',
      ],
      isGlobal: true,
    }),
    cacheStore,
    UsersModule,
  ],
  controllers: [
    // main controller, currently only a 'hello world' response
    AppController,
  ],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
  exports: [cacheStore],
})
export class AppModule {}
