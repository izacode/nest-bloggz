import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService } from '../emails/email.service';
import { AuthService } from '../auth/auth.service';
import { User, UserSchema } from '../schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailManager } from '../emails/email.manager';
import { EmailAdapter } from '../emails/email.adapter';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    EmailAdapter,
    UsersService,
    UsersRepository,
    AuthService,
    EmailService,
    JwtService,
    EmailManager,
  ],
})
export class UsersModule {}
