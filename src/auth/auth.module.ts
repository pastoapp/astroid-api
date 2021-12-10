import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabasesModule } from 'src/databases/databases.module';
import { OrbitdbModule } from 'src/orbitdb/orbitdb.module';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    DatabasesModule,
    OrbitdbModule,
    UsersModule,
    PassportModule,
    // TODO: Critcal for production -> Change
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
