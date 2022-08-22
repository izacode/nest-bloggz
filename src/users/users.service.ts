import { Injectable } from '@nestjs/common';
import mongoose, { ObjectId } from 'mongoose';
// import { ObjectId } from "mongodb";
// import { Types} from "mongoose";
import { FilterDto } from 'src/dto/filter.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async checkRevokedTokensList(refreshToken: string, _id: string) {
    return this.usersRepository.checkRevokedTokensList(refreshToken, _id);
  }

  async updateRevokedTokensList(refreshToken: string, id: string): Promise<Boolean> {
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
}
