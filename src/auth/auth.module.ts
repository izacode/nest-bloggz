import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailAdapter } from 'src/emails/email.adapter';
import { EmailManager } from 'src/emails/email.manager';
import { EmailService } from 'src/emails/email.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersRepository } from 'src/users/users.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { AttemptsMiddleware } from 'src/middleware/attempts.middleware';
import { Attempt, AttemptSchema } from 'src/schemas/attempt.schema';
import { LocalStrategy } from './strategies/local.strategy';
// import { JwtService } from 'src/application/jwt.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BasicStrategy } from './strategies/basic.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Attempt.name,
        schema: AttemptSchema,
      },
    ]),
    PassportModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    UsersRepository,
    UsersService,
    EmailManager,
    EmailAdapter,
    ConfigService,
    LocalStrategy,
    JwtStrategy,
    BasicStrategy,
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AttemptsMiddleware)
      .forRoutes(
        'auth/login',
        'auth/registration',
        'auth/registration-confirmation',
        'auth/registration-email-resending',
      );
  }
}
