import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabasesModule } from './databases/databases.module';

@Module({
  imports: [DatabasesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
