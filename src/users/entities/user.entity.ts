import { Message } from 'src/messages/entities/message.entity';

export class User {
  id: string;
  publicKey: string;
  nonce: string;
  isAdmin: boolean;
  messages?: string[] | Message[];
  createdAt?: string;
  updatedAt?: string;
}
