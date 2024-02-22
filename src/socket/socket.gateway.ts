import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway({ cors: true, namespace: 'chat' })
export class SocketGateway {
    constructor(private readonly socketService: SocketService) {}
    @WebSocketServer() server: Server;

    @SubscribeMessage('message')
    handleMessage(
        @MessageBody()
        data: {
            owner: string;
            sentTo: string;
            content: string;
        },
    ) {
        const room = [data.owner, data.sentTo].sort().join('');
        const date = new Date();
        const currentTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        const message = { ...data, timestamp: currentTime };
        this.socketService.saveMessage(
            {
                owner: message.owner,
                content: message.content,
                timestamp: message.timestamp,
            },
            room,
        );
        this.server.to(room).emit('message', message);
    }

    @SubscribeMessage('joinRoom')
    async handleJoinRoom(
        client: Socket,
        data: { client1: string; client2: string },
    ) {
        const room = [data.client1, data.client2].sort().join('');
        client.join(room);
        await this.socketService.createRoom(room);
        const roomExists = await this.socketService.roomExists(room);
        if (roomExists) {
            const messages = await this.socketService.getMessagesFromRoom(room);
            this.server.to(room).emit('roomStoredMessages', messages);
        }
    }
}
