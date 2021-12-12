import { Module } from '@nestjs/common';
import { DatabasesModule } from 'src/databases/databases.module';
import { OrbitdbModule } from 'src/orbitdb/orbitdb.module';
import { CaslAbilityFactory } from './casl-ability.factory';

@Module({
  imports: [OrbitdbModule, DatabasesModule],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
