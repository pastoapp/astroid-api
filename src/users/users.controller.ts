import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Class that handles user requests
 */
@Controller('users')
export class UsersController {
  /**
   * Default constructor
   * @param usersService user service methods and logic {@link UserService}
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a user from a post request
   * @param createUserDto {@link CreateUserDto}
   * @returns created user info, including a hash and ID.
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Request all users
   * @returns All registered users
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Finds a specific user
   * @param id user ID
   * @returns the user info, including a hash and ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    //TODO: Append Only? Authorization? API Design?
    throw new Error('Not implemented');
    // const user = await this.usersService.findOne(id);
    // return user;
  }

  /**
   * Updates a user with ID
   * @param id user ID
   * @param updateUserDto new user Info
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //TODO: Authorization
    // maybe redundant because of implementation/design structure => append only storage
    throw new Error('Not Implemented');
    //   return this.usersService.update(id, updateUserDto);
  }

  /**
   * Deletes a user with ID
   * @param id user ID
   * @returns result of deletion
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    ///TODO: Authorization
    // maybe redundant because of implementation/design structure => append only storage/TODO: Authorization
    throw new Error('Not Implemented');
    //   return this.usersService.remove(id);
  }
}
