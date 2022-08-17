import { Injectable } from "@nestjs/common";
import mongoose from "mongoose";
// import { Types} from "mongoose";
import { FilterDto } from "src/dto/filter.dto";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService{
    constructor(private usersRepository: UsersRepository) {}

    async getUsers(filterDto: FilterDto){
        return this.usersRepository.getUsers(filterDto)
    }

    async deleteUser(id: string) {

        const _id = new mongoose.Types.ObjectId(id)
        return this.usersRepository.deleteUser(_id);
    }

}