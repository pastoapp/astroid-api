import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabasesModule } from 'src/databases/databases.module';
import { OrbitdbModule } from 'src/orbitdb/orbitdb.module';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './jwt-config.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        DatabasesModule,
        OrbitdbModule,
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            useClass: JwtConfigService,
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtConfigService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
