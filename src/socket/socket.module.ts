import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketService } from './socket.service';
import { Room, RoomSchema } from './schemas/room.schema';
import { SocketGateway } from './socket.gateway';
import { User, UserSchema } from 'src/schemas/user.schema';
@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Room.name,
                schema: RoomSchema,
            },
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
    ],
    providers: [SocketService, SocketGateway],
})
export class SocketModule {}
