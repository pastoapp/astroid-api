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
import { OrbitDbService } from '../orbitdb/orbitdb.service';
import { DatabasesService } from './databases.service';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';

// TODO: #4 provide appropiate http response status'

@Controller('databases')
export class DatabasesController {
  constructor(
    private readonly databasesService: DatabasesService,
    private _orbit: OrbitDbService, // Inject OrbitDB Service
  ) {}

  @Get('/')
  findAll() {
    return this.databasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.databasesService.findOne(id);
  }

  @Get(':id/value')
  dbValue(@Param('id') id: string) {
    throw new Error('not implemented');
  }

  @Get(':id/:item')
  dbItem(@Param('id') id: string, @Param('item') item) {
    throw new Error('not implemented');
  }

  @Get(':id/iterator')
  dbIterator(@Param('id') id: string) {
    throw new Error('not implemented');
  }

  @Get(':id/index')
  dbIndex(@Param('id') id: string) {
    throw new Error('not implemented');
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

  @Post(':id/query')
  dbQuery(@Param('id') id: string) {
    // Modulus Query + Range Query
    throw new Error('not implemented');
  }

  @Post(':id/add')
  dbAdd(@Param('id') id: string) {
    throw new Error('not implemented');
  }

  @Post(':id/put')
  dbPut(@Param('id') id: string) {
    throw new Error('not implemented');
  }

  @Post(':id/inc')
  dbInc(@Param('id') id: string) {
    throw new Error('not implemented');
  }

  dbIncVal(@Param('id') id: string, @Param('val') val: number) {
    throw new Error('not implemented');
  }

  @Post(':id/access/write')
  dbAccessWrite(@Param('id') id: string) {
    throw new Error('not implemented');
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

  @Delete(':id/:item')
  deleteItem(@Param('id') id: string, @Param('item') item: string) {
    // TODO: implement Endpoint `deleteItem`
    throw new Error('not implemented');
  }
}
