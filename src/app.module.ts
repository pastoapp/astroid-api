import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabasesModule } from './databases/databases.module';
import { IdentityController } from './identity/identity.controller';
import { OrbitService } from './orbit.service';

@Module({
  imports: [DatabasesModule],
  controllers: [AppController, IdentityController],
  providers: [AppService, OrbitService],
})
export class AppModule {}
