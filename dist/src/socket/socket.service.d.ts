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
import { Room } from './schemas/room.schema';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
export declare class SocketService {
    private roomModel;
    private userModel;
    constructor(roomModel: Model<Room>, userModel: Model<User>);
    createRoom(roomName: string): Promise<import("mongoose").Document<unknown, {}, Room> & Room & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteRoom(roomName: string): Promise<void>;
    roomExists(roomName: string): Promise<boolean>;
    getMessagesFromRoom(roomName: string): Promise<{
        content: string;
        owner: string;
        timestamp: string;
    }[]>;
    saveMessage(message: {
        content: string;
        owner: string;
        timestamp: string;
    }, roomName: string): Promise<void>;
    updateUserState(userName: string, state: string): Promise<boolean>;
}
