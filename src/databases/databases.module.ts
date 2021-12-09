import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { OrbitdbModule } from 'src/orbitdb/orbitdb.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [OrbitdbModule],
  controllers: [DatabasesController],
  providers: [DatabasesService],
  exports: [DatabasesService],
})
export class DatabasesModule {}
