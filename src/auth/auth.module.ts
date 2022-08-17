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
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    UsersRepository,
    EmailManager,
    EmailAdapter,
    ConfigService,
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AttemptsMiddleware)
      .forRoutes('auth/registration', 'auth/registration-confirmation');
  }
}
