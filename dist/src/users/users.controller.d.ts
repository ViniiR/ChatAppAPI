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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { UsersService } from './users.service';
import { CreateUserDTO } from './DTO/CreateUser.dto';
import { Request, Response } from 'express';
import { ContactDTO } from './DTO/ContactDTO';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    createUser(createUserDTO: CreateUserDTO): Promise<import("mongoose").Document<unknown, {}, import("../schemas/user.schema").User> & import("../schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    loginUser(res: Response, userInfo: CreateUserDTO): Promise<Response<any, Record<string, any>>>;
    authorization(req: Request, res: Response): Response<any, Record<string, any>>;
    info(req: Request, res: Response): Promise<Response<any, Record<string, any>> | 400>;
    addContact(contactDTO: ContactDTO, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    methodName(body: {
        name: string;
        userName: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteUser(userName: string, res: Response): Promise<Response<any, Record<string, any>>>;
    endSession(res: Response): void;
}
