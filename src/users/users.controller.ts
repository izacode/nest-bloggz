import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common';
import { FilterDto } from '../dto/filter.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  async getAllUsers(@Query() filter: FilterDto) {
    return await this.usersService.getUsers(filter);
  }

  @HttpCode(204)
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return;
  }
}
