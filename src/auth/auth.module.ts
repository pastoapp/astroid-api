import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabasesModule } from 'src/databases/databases.module';
import { OrbitdbModule } from 'src/orbitdb/orbitdb.module';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [DatabasesModule, OrbitdbModule, UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
