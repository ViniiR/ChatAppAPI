import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './schemas/room.schema';
import { Model } from 'mongoose';

@Injectable()
export class SocketService {
    constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

    async createRoom(roomName: string) {
        const room = await this.roomModel.findOne({ roomName });
        if (!room) {
            const newRoom = new this.roomModel({ roomName });
            await newRoom.save();
        }
        return this.roomModel.findOne({ roomName });
    }

    async deleteRoom(roomName: string) {
        //
    }

    async roomExists(roomName: string) {
        const room = await this.roomModel.findOne({ roomName });
        return room != null;
    }

    async getMessagesFromRoom(roomName: string) {
        const messages = await this.roomModel.findOne({ roomName });
        return messages.messages;
    }

    async saveMessage(
        message: {
            content: string;
            owner: string;
            timestamp: string;
        },
        roomName: string,
    ) {
        try {
            const room = await this.roomModel.findOne({ roomName });
            let messages = room.messages;
            if (!messages) messages = [];
            messages.push(message);
            await this.roomModel.findOneAndUpdate({ roomName }, { messages });
        } catch (error) {
            throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
