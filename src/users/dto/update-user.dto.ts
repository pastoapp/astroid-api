import { PartialType } from "@nestjs/mapped-types";
// import { Message } from '../../messages/entities/message.entity';
import { CreateUserDto } from "./create-user.dto";

/**
 * Data transport Object for updating a user
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  publicKey?: string;
  // messages?: string[] | Message[];
}
