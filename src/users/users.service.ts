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

    async userExists(userName: string) {
        const foundUser = await this.userModel
            .findOne({
                userName: userName,
            })
            .exec();
        if (!foundUser) {
            return false;
        }
        return true;
    }

    async addContact(userName: string, contactName: string) {
        const user = await this.userModel.findOne({ userName }).exec();
        let updatedContacts = [];
        if (user.contacts.includes(contactName)) {
            updatedContacts = user.contacts;
            return false;
        } else if (!user.contacts || user.contacts.length < 1) {
            updatedContacts = [contactName];
        } else {
            updatedContacts = user.contacts;
            updatedContacts.push(contactName);
        }
        await this.userModel.findOneAndUpdate(
            {
                userName,
            },
            { contacts: updatedContacts },
            { new: true },
        );
        return true;
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
    async getUserInfo(userName: string) {
        const foundUser = await this.userModel
            .findOne({
                userName,
            })
            .exec();
        if (!foundUser) return { isUser: false, userInfo: null };
        return {
            isUser: true,
            userInfo: {
                name: foundUser.userName,
                contacts: foundUser.contacts,
            },
        };
    }
}
