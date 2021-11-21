import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabasesModule } from './databases/databases.module';
import { IdentityController } from './identity/identity.controller';
import { OrbitdbModule } from './orbitdb/orbitdb.module';

@Module({
  imports: [DatabasesModule, OrbitdbModule],
  controllers: [AppController, IdentityController],
  providers: [AppService],
})
export class AppModule {}
