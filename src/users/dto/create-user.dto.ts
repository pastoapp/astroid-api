import { IsNotEmpty, IsString } from "class-validator";

/**
 * Data transport Object for creating users user
 */
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  publicKey: string;
}
