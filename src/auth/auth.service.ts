import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import * as datefns from 'date-fns';
// import add from 'date-fns/add';
import { ObjectId } from 'mongodb';

import { User } from 'src/schemas/user.schema';
import { UsersRepository } from 'src/users/users.repository';
import { EmailService } from 'src/emails/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private emailService: EmailService,
    private usersRepository: UsersRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const { login, email, password } = createUserDto;
    // const isUserExists = await this.usersRepository.findUserByLoginOrEmail(login, email)
    // if(isUserExists) throw new ConflictException();
    const passwordHash = await this._generateHash(password);
    const user = {
      _id: new ObjectId(),
      accountData: {
        userName: login,
        email,
        passwordHash,
        createdAt: new Date(),
        revokedRefreshTokens: [],
      },
      loginAttempts: [],
      emailConfirmation: {
        sentEmails: [], //Add to send emails, create counter or smth
        confirmationCode: uuidv4(),
        expirationDate: datefns.add(new Date(), {
          days: 1,
          hours: 0,
        }),
        isConfirmed: false,
      },
    };
    const createResult = await this.usersRepository.createUser(user);

    try {
      const result = await this.emailService.sendEmailConfirmationMassage(user);
      // const result = await emailManager.sendEmailConfirmationMassage(user);
      if (result) {
        await this.usersRepository.updateSentEmails(user._id);
      }
    } catch (error) {
      await this.usersRepository.deleteUser(user._id);
    }

    return createResult;
  }

  async _generateHash(password: string) {
    
 
    const hashh = await bcrypt.hash(password, 10);
    return hashh;
  }

  async validateUser(login: string, password: string) {
    const user: User = await this.usersRepository.findUserByLogin(login);

    if (!user) return null;

    const areHashesEqual = await this._isPasswordCorrect(
      password,
      user.accountData.passwordHash,
    );
    if (!areHashesEqual) return null;
    return user;
  }
  async _isPasswordCorrect(password: string, hash: string) {
    const isCorrect = await bcrypt.compare(password, hash);
    return isCorrect;
  }
}
