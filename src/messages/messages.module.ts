import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { OrbitdbModule } from 'src/orbitdb/orbitdb.module';
import { DatabasesModule } from 'src/databases/databases.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [OrbitdbModule, DatabasesModule, UsersModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
