// import { Message } from '../../messages/entities/message.entity';

/**
 * Stores information about a user.
 */
export class User {
  _id: string;
  publicKey: string;
  nonce: string;
  isAdmin: boolean;
  messages?: string[]; //| Message[];
  createdAt?: string;
  updatedAt?: string;
}
