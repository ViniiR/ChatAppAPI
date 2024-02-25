/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDTO } from './DTO/CreateUser.dto';
import { Response } from 'express';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    createUser(createUserDTO: CreateUserDTO): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    userExists(userName: string): Promise<boolean>;
    addContact(userName: string, contactName: string): Promise<boolean>;
    findUser(user: CreateUserDTO): Promise<boolean>;
    getUserInfo(userName: string): Promise<{
        isUser: boolean;
        userInfo: {
            name: string;
            contacts: string[];
        };
    }>;
    removeContact(removeFrom: string, userName: string, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteUser(userName: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getStatus(userName: string): Promise<{
        userName: string;
        state: string;
    }>;
}
