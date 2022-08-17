import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  public validate = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    if (
      process.env.BASIC_AUTH_USERNAME === username &&
      process.env.BASIC_AUTH_PASSWORD === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
