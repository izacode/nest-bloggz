import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { ObjectId } from "mongodb";
// import { Types} from "mongoose";
import { FilterDto } from 'src/dto/filter.dto';





import { v4 as uuidv4 } from 'uuid';
import * as datefns from 'date-fns';


import { UsersRepository } from '../users/users.repository';

import * as bcrypt from 'bcrypt';
import { EmailService } from '../emails/email.service';
import { CreateUserDto } from './dto/create-user.dto';





@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository,private emailService: EmailService) {}

  async checkRevokedTokensList(refreshToken: string, _id: string) {
    return this.usersRepository.checkRevokedTokensList(refreshToken, _id);
  }

  async updateRevokedTokensList(
    refreshToken: string,
    id: string,
  ): Promise<Boolean> {
    return this.usersRepository.updateRevokedTokensList(refreshToken, id);
  }

  async getUsers(filterDto: FilterDto) {
    return this.usersRepository.getUsers(filterDto);
  }

  async getUserById(id: any) {
    return this.usersRepository.getUserById(id);
  }

  async deleteUser(id: string) {
    const _id = new mongoose.Types.ObjectId(id);
    return this.usersRepository.deleteUser(_id);
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    debugger;
    const { login, email, password } = createUserDto;
    // const isUserExists = await this.usersRepository.findUserByLoginOrEmail(login, email)
    // if(isUserExists) throw new BadRequestException();
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
    const createResult = await this.usersRepository.createUser1(user);

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
}
