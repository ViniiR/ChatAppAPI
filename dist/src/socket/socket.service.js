"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const room_schema_1 = require("./schemas/room.schema");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
let SocketService = class SocketService {
    constructor(roomModel, userModel) {
        this.roomModel = roomModel;
        this.userModel = userModel;
    }
    async createRoom(roomName) {
        const room = await this.roomModel.findOne({ roomName });
        if (!room) {
            const newRoom = new this.roomModel({ roomName });
            await newRoom.save();
        }
        return this.roomModel.findOne({ roomName });
    }
    async deleteRoom(roomName) {
    }
    async roomExists(roomName) {
        const room = await this.roomModel.findOne({ roomName });
        return room != null;
    }
    async getMessagesFromRoom(roomName) {
        const messages = await this.roomModel.findOne({ roomName });
        return messages.messages;
    }
    async saveMessage(message, roomName) {
        try {
            const room = await this.roomModel.findOne({ roomName });
            let messages = room.messages;
            if (!messages)
                messages = [];
            messages.push(message);
            await this.roomModel.findOneAndUpdate({ roomName }, { messages });
        }
        catch (error) {
            throw new common_1.HttpException('Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateUserState(userName, state) {
        try {
            await this.userModel.findOneAndUpdate({ userName }, { $set: { onlineState: state } }, { returnDocument: 'after', upsert: true });
            return true;
        }
        catch (err) {
            return false;
        }
    }
};
exports.SocketService = SocketService;
exports.SocketService = SocketService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(room_schema_1.Room.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SocketService);
//# sourceMappingURL=socket.service.js.map