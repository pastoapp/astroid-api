// import { Message } from '../../messages/entities/message.entity';

export class User {
  _id: string;
  publicKey: string;
  nonce: string;
  isAdmin: boolean;
  messages?: string[]; //| Message[];
  createdAt?: string;
  updatedAt?: string;
}
