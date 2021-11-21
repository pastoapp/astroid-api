import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdentityController } from './identity/identity.controller';
import { IpfsApiService } from './ipfs-api/ipfs-api.service';
import { DatabasesModule } from './databases/databases.module';
import { OrbitService } from './orbit.service';

@Module({
  imports: [DatabasesModule],
  controllers: [AppController, IdentityController],
  providers: [AppService, IpfsApiService, OrbitService],
})
export class AppModule {}
