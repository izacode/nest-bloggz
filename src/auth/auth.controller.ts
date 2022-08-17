import { Body, Controller, HttpCode,ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(204)
  @Post('/registration')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @HttpCode(204)
  @Post('/registration-confirmation')
  async confirmRegistration(@Body('code', ParseUUIDPipe) code: string) {
    return this.authService.confirmEmail(code)
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login() {}


}
