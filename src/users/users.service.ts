import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDTO } from './DTO/CreateUser.dto';
import { isHashValid } from 'hashing';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    createUser(createUserDTO: CreateUserDTO) {
        const newUser = new this.userModel(createUserDTO);
        return newUser.save();
    }

    async findUser(user: CreateUserDTO) {
        const foundUser = await this.userModel
            .findOne({
                userName: user.userName,
            })
            .exec();
        if (!foundUser) {
            return false;
        }
        const isUser = await isHashValid(user.password, foundUser.password);
        return isUser;
    }
}
