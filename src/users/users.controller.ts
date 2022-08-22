import { Controller, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';



@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return
  }
}
