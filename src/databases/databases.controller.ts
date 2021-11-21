import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { OrbitService } from 'src/orbit.service';
import { DatabasesService } from './databases.service';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';

// TODO: #4 provide appropiate http response status'

@Controller('databases')
export class DatabasesController {
  constructor(
    private readonly databasesService: DatabasesService,
    private orbit: OrbitService, // Inject OrbitDB Service
  ) {}

  // TMP TESTING
  @Get('/test/dulli')
  async identity() {
    const api = await OrbitService.API;

    return api.identity();
  }

  @Post(':id')
  async create(
    @Body() createDatabaseDto: CreateDatabaseDto,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    try {
      const result = await this.databasesService.create(createDatabaseDto, id);
      response.json(result);
    } catch (e) {
      response.status(500).json({ error: e.message });
    }
  }

  @Get('/')
  findAll() {
    return this.databasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.databasesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDatabaseDto: UpdateDatabaseDto,
    @Res() response: Response,
  ) {
    try {
      const result = await this.databasesService.update(id, updateDatabaseDto);
      response.json(result);
    } catch (e) {
      response.status(500).json({ error: e.mesage });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.databasesService.remove(id);
  }
}
