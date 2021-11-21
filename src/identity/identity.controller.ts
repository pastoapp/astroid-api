import { Controller, Get } from '@nestjs/common';
import { OrbitService } from '../orbit.service';

@Controller('identity')
export class IdentityController {
  constructor(private _orbit: OrbitService) {}

  @Get()
  async sendIdentity() {
    return (await OrbitService.API).identity();
  }
}
