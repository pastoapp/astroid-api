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
import { response, Response } from 'express';
import { OrbitDbService } from '../orbitdb/orbitdb.service';
import { DatabasesService } from './databases.service';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { AddItemDto } from './dto/add-item.dto';

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
        // TODO: refactor response to example
        // {"docstore":{"address":{"root":"zdpuAmnfJZ6UTssG5Ns3o8ALXZJXVx5eTLTxf7gfFzHxurbJq","path":"docstore"},"dbname":"docstore","id":"/orbitdb/zdpuAmnfJZ6UTssG5Ns3o8ALXZJXVx5eTLTxf7gfFzHxurbJq/docstore","options":{"create":"true","indexBy":"_id","localOnly":false,"maxHistory":-1,"overwrite":true,"replicate":true},"type":"docstore"},"feed":{"address":{"root":"zdpuAo6DwafMiyuzhfEojXJThFPdv4Eu9hLfaWrKD6GSVzyjj","path":"feed"},"dbname":"feed","id":"/orbitdb/zdpuAo6DwafMiyuzhfEojXJThFPdv4Eu9hLfaWrKD6GSVzyjj/feed","options":{"create":"true","localOnly":false,"maxHistory":-1,"overwrite":true,"replicate":true},"type":"feed"}}
        // TODO: check if data is persistent
        const newID = id.replace(/^db_/, ''); // allow db_ prefixed id requests
        return this.databasesService.findOne(newID);
    }

    @Get(':id/value')
    dbValue(@Param('id') id: string) {
        throw new Error('not implemented');
    }

    @Get(':id/:item')
    async dbItem(
        @Param('id') id: string,
        @Param('item') item,
        @Res() response,
    ) {
        try {
            const result = await this.databasesService.getItemFromKeyValue(
                id,
                item,
            );
            response.json(result);
        } catch (e) {
            response.status(500).json({ error: e.message });
        }
    }

    @Get(':id/iterator')
    dbIterator(@Param('id') id: string) {
        throw new Error('not implemented');
    }

    @Get(':id/index')
    dbIndex(@Param('id') id: string) {
        throw new Error('not implemented');
    }

    @Post('/')
    async create(
        @Body() createDatabaseDto: CreateDatabaseDto,
        @Res() response: Response,
    ) {
        try {
            const result = await this.databasesService.create(
                createDatabaseDto,
            );
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

    //TODO: design decision: Key Value Only.
    /**
     * Adds a new entry to the eventlog or feed database :dbname.
     * Returns the multihash of the new record entry.
     * Can only be used on eventlog|feed
     * @param id database id
     */
    @Post(':id/add')
    async dbAdd(@Param('id') id: string, @Body() additem: AddItemDto) {
        throw new Error('not implemented');
        // const hash = await this.databasesService.addItemToFeedOrEventLog(
        //   id,
        //   additem,
        // );
        // return hash;
    }

    @Post(':id/put')
    async dbPut(
        @Param('id') id: string,
        @Body() body: { key: string; value: any },
        @Res() response,
    ) {
        try {
            const result = await this.databasesService.addItemToKeyValue(
                id,
                body,
            );
            response.json(result);
        } catch (e) {
            response.status(500).json({ error: e.message });
        }
    }

    @Post(':id/inc')
    dbInc(@Param('id') id: string) {
        throw new Error('not implemented');
    }

    dbIncVal(@Param('id') id: string, @Param('val') val: number) {
        throw new Error('not implemented');
    }

    //Adds the id to the list of peers who have write access to the :dbname data store.
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
            const result = await this.databasesService.update(
                id,
                updateDatabaseDto,
            );
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
        // throw new Error('not implemented');
        this.databasesService.removeItem(id, item);
    }
}
