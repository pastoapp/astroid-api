import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtUserRequest } from 'src/app.controller';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Post()
    create(
        @Req() { user: { uid } }: JwtUserRequest,
        @Body() createMessageDto: CreateMessageDto,
    ) {
        return this.messagesService.create(uid, createMessageDto);
    }

    @Get()
    findAll(@Req() { user: { uid } }: JwtUserRequest) {
        return this.messagesService.findAll(uid);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.messagesService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateMessageDto: UpdateMessageDto,
    ) {
        return this.messagesService.update(+id, updateMessageDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.messagesService.remove(+id);
    }
}
