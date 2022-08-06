import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { FilterDto } from 'src/dto/filter.dto';
import { CustomResponseType } from 'src/main/types';
import { Attempt } from 'src/schemas/attempt.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UsersRepository {
  @InjectModel(User.name) private userModel: Model<User>;
  @InjectModel(Attempt.name) private attemptModel: Model<Attempt>;

  async checkTokenList(refreshToken: string, _id: string): Promise<Boolean> {
    const doc = await this.userModel.findById({ _id: new Types.ObjectId(_id) });

    if (!doc) return false;

    return doc.accountData.revokedRefreshTokens.includes(refreshToken);
  }
  async updateTokenList(refreshToken: string, _id: string): Promise<Boolean> {
    const doc = await this.userModel.findById({ _id: new Types.ObjectId(_id) });
    if (!doc) return false;
    doc.accountData.revokedRefreshTokens.push(refreshToken);
    await doc.save();

    return true;
  }
  async getUsers(filterDto: FilterDto): Promise<CustomResponseType> {
    const { PageNumber = 1, PageSize = 10 } = filterDto;
    const users = await this.userModel
      .find({}, '-_id -passwordHash -passwordSalt')
      //   .find({}, { projection: { _id: 0, passwordHash: 0, passwordSalt: 0 } })
      .skip((+PageNumber - 1) * +PageSize)
      .limit(+PageSize)
      .sort({ id: 1 })
      .exec();

    const totalCount: number = await this.userModel.countDocuments();

    const customResponse = {
      pagesCount: Math.ceil(totalCount / +PageSize),
      page: +PageNumber,
      pageSize: +PageSize,
      totalCount,
      items: users,
    };
    return customResponse;
  }
  async createUser(user: User): Promise<User | null> {
    await this.userModel.create(user);
    const createdUser = await this.userModel.findOne({ _id: user._id });
    return createdUser;
  }
  async findUserByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    const user = await this.userModel
      .findOne({
        $or: [
          { 'accountData.userName': loginOrEmail },
          { 'accountData.email': loginOrEmail },
        ],
      })
      .exec();
       if (!user) throw new NotFoundException();
    return user;
  }
  async findUserByLogin(login: string): Promise<User | null> {
    const user = await this.userModel.findOne({ login });
     if (!user) throw new NotFoundException();
    return user;
  }
  async findUserById(_id: ObjectId): Promise<User | null> {
    const user = await this.userModel.findOne({ _id });
    if(!user) throw new NotFoundException()
    return user;
  }
  async findUserByConfirmationCode(code: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
    return user;
  }
  async updateConfirmationStatus(_id: ObjectId): Promise<boolean> {

    const result = await this.userModel.updateOne(
      { _id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );

    return result.matchedCount === 1;
  }

  async updateConfirmationCode(
    _id: ObjectId,
    newCode: string,
  ): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { _id },
      { $set: { 'emailConfirmation.confirmationCode': newCode } },
    );
    return result.matchedCount === 1;
  }
  async updateSentEmails(_id: ObjectId): Promise<boolean> {
    const doc = await this.userModel.findById({ _id });
    if (!doc) return false;
    doc.emailConfirmation.sentEmails.push({ sentDate: new Date() });
    await doc.save();
    return true;
  }
  async deleteUser(_id): Promise<boolean> {
    const isDeleted = await this.userModel.deleteOne({ _id });
    return isDeleted.deletedCount === 1;
  }
  async deleteAllUsers() {
    await this.userModel.deleteMany({});
    const totalCount: number = await this.userModel.countDocuments({});
    if (totalCount !== 0) return false;
    return true;
  }
  async deleteAllUsersAccount() {
    await this.userModel.deleteMany({});
    const totalCount: number = await this.userModel.countDocuments({});
    if (totalCount !== 0) return false;
    return true;
  }

  // Ips and requests================================================================
  async deleteAllIps() {
    await this.attemptModel.deleteMany({});
    const totalCount: number = await this.attemptModel.countDocuments({});
    if (totalCount !== 0) return false;
    return true;
  }
  // async deleteAllRequests() {
  //   await requestsCollection.deleteMany({});
  //   const totalCount: number = await requestsCollection.countDocuments({});
  //   if (totalCount !== 0) return false;
  //   return true;
  // }
  // async saveRequests(income: any): Promise<boolean> {
  //   await requestsCollection.insertOne(income);

  //   const isAdded = await requestsCollection.findOne({ requestIp: income.requestIp });
  //   if (!isAdded) return false;
  //   return true;
  // }
  // async getAllRequests() {
  //   const list = await registrationIpCollection.find().toArray();
  //   return list;
  // }
}
