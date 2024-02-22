import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDTO } from './DTO/CreateUser.dto';
import { isHashValid } from 'hashing';
import { Response } from 'express';

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
    async removeContact(
        removeFrom: string,
        userName: string,
        @Res() res: Response,
    ) {
        const userId = await this.userModel.findOne({ userName: removeFrom });
        try {
            await this.userModel.findByIdAndUpdate(userId, {
                $pull: { contacts: userName },
            });
            return res.sendStatus(200);
        } catch (err) {
            throw new HttpException(
                'Failed to update user data',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async deleteUser(userName: string, res: Response) {
        try {
            await this.userModel.deleteOne({ userName });
            res.cookie('secret-access-token', '', {
                httpOnly: true,
                expires: new Date(0),
            });
            return res.status(204).send();
        } catch (err) {
            throw new HttpException(
                'server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
