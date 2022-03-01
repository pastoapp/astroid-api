import { PartialType } from "@nestjs/mapped-types";
// import { Message } from '../../messages/entities/message.entity';
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  publicKey?: string;
  // messages?: string[] | Message[];
}
