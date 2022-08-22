import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  ParseUUIDPipe,
  Post,
  Get,
  UseGuards,
  Res,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ObjectId } from 'mongodb';
import { CurrentUserData } from 'src/common/current-user-data.param.decorator';
// import { JwtService } from 'src/application/jwt.service';
import { EmailDto } from 'src/dto/email.dto';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { Request, Response } from 'express';
import { Cookies } from 'src/common/cookies.param.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private config: ConfigService,
  ) {}

  @HttpCode(204)
  @Post('/registration')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @HttpCode(204)
  @Post('/registration-confirmation')
  async confirmRegistration(@Body('code', ParseUUIDPipe) code: string) {
    return this.authService.confirmEmail(code);
  }

  @HttpCode(204)
  @Post('/registration-email-resending')
  async resendConfirmaitionEmail(@Body() emailDto: EmailDto) {
    const result = await this.authService.resendConfirmaitionEmail(emailDto);
    if (!result) throw new BadRequestException();
    return;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @CurrentUserData() currentUserData: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { sub, username } = currentUserData;
    const payload = { username, sub };
    
    

    // IIFE solution
    // let payload = (({ sub, username }) => ({ sub, username }))(currentUserData);

    const accessToken = await this.authService.createToken(
      payload,
      `${process.env.ACCESS_TOKEN_SECRET}`,
      `${process.env.JWT_ACCESS_EXPIRATION}`,
    );
  
    const refreshToken = await this.authService.createToken(
      payload,
      `${process.env.REFRESH_TOKEN_SECRET}`,
      `${process.env.JWT_REFRESH_EXPIRATION}`,
    );

    response.cookie('refreshToken', refreshToken);
    // response.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    // });

    return { accessToken, refreshToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async showUserInfo(@CurrentUserData() currentUserData: any) {
    const userInfo = {
      email: currentUserData.email,
      login: currentUserData.username,
      userId: currentUserData.sub,
    };
    return userInfo;
  }

  @Post('refresh-token')
  async refreshTokens(
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { sub, username } = await this.authService.validateToken(
      refreshToken,
    );
    const payload = { sub, username };

    await this.usersService.updateRevokedTokensList(refreshToken, payload.sub);

     const accessToken = await this.authService.createToken(
       payload,
       `${process.env.ACCESS_TOKEN_SECRET}`,
       `${process.env.JWT_ACCESS_EXPIRATION}`,
     );
     const newRefreshToken = await this.authService.createToken(
       payload,
       `${process.env.REFRESH_TOKEN_SECRET}`,
       `${process.env.JWT_REFRESH_EXPIRATION}`,
     );

    response.cookie('refreshToken', newRefreshToken, {
      //  httpOnly: true,
      //  secure: true,
    });

    return { accessToken };
  }
  @HttpCode(204)
  @Post('/logout')
  async logoutUser(
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,

  ) {

    const { sub } = await this.authService.validateToken(refreshToken);

    await this.usersService.updateRevokedTokensList(refreshToken, sub);

    response.clearCookie('refreshToken', {
      // httpOnly: true,
      // secure: true,
    });
  }
}
