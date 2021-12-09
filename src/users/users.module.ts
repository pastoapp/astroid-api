import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { OrbitdbModule } from 'src/orbitdb/orbitdb.module';
import { DatabasesModule } from 'src/databases/databases.module';

@Module({
  imports: [OrbitdbModule, DatabasesModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
