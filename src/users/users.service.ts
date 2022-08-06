import { Injectable } from "@nestjs/common";
import { Types} from "mongoose";
import { FilterDto } from "src/dto/filter.dto";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService{
    constructor(private usersRepository: UsersRepository) {}

    async getUsers(filterDto: FilterDto){
        return this.usersRepository.getUsers(filterDto)
    }

    async deleteUser(id: string) {
        debugger
        const _id = new Types.ObjectId(id)
        return this.usersRepository.deleteUser(_id);
    }

}