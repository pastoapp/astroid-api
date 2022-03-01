import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { encryptMessage, decryptMessage } from '@pastoapp/astroid-keys';
import { DatabasesService } from 'src/databases/databases.service';
import { Message } from './entities/message.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MessagesService {
    private readonly logger = new Logger(MessagesService.name);
    constructor(
        private readonly usersService: UsersService,
        private readonly databaseService: DatabasesService,
    ) {}

    async create(uid: string, createMessageDto: CreateMessageDto) {
        const user = await this.usersService.findOne(uid);
        const { id, publicKey, messages } = user;
        const { content } = createMessageDto;

        const encryptedContent = await encryptMessage(content, publicKey);

        const { hash } = await this.databaseService.addItemToKeyValue<Message>(
            'messages',
            {
                key: uuid(),
                value: {
                    content: encryptedContent,
                    id: uuid(),
                    uid: id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            },
        );

        const userUpdate = await this.usersService.update(id, {
            // TODO: add docstore support
            // messages: [...((messages ?? []) as string[]), hash],
            messages: [...((messages ?? []) as string[]), hash],
        });

        return {
            userUpdate,
            hash,
        };
    }

    async findAll(uid: string) {
        const msgs = await this.databaseService.getAllItemsFromKeyValue(
            'messages',
        );
        const { messages } = await this.usersService.findOne(uid);
        return messages;
    }

    findOne(id: number) {
        return `This action returns a #${id} message`;
    }

    update(id: number, updateMessageDto: UpdateMessageDto) {
        return `This action updates a #${id} message`;
    }

    remove(id: number) {
        return `This action removes a #${id} message`;
    }
}
