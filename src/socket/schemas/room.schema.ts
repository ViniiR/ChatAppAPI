import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Room {
    @Prop({ required: true, unique: true })
    roomName: string;

    @Prop({ required: false })
    messages?: Array<{
        content: string;
        owner: string;
        timestamp: string;
    }>;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
