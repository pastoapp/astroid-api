import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabasesModule } from './databases/databases.module';
import { IdentityController } from './identity/identity.controller';
import { OrbitdbModule } from './orbitdb/orbitdb.module';
import { ConfigModule } from '@nestjs/config';
import type { ClientOpts as RedisClientOpts } from 'redis';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import * as redisStore from 'cache-manager-redis-store';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    // database module
    DatabasesModule,
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
    CacheModule.register<RedisClientOpts>({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      isGlobal: true,
      ttl: 0,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [
    // main controller, currently only a 'hello world' response
    AppController,
    // Idenetity request
    IdentityController,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
