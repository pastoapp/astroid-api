import { Controller, Get } from '@nestjs/common';
import { OrbitDbService } from 'src/orbitdb/orbitdb.service';

@Controller('identity')
export class IdentityController {
  constructor(private _orbit: OrbitDbService) {}

  @Get()
  async sendIdentity() {
    return (await OrbitDbService.API).identity;
  }
}
