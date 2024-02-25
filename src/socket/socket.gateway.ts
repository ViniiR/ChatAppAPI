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
    async handleMessage(
        @MessageBody()
        data: {
            owner: string;
            sentTo: string;
            content: string;
            currentTime: string;
        },
    ) {
        const room = [data.owner, data.sentTo].sort().join('');
        await this.socketService.saveMessage(
            {
                owner: data.owner,
                content: data.content,
                timestamp: data.currentTime,
            },
            room,
        );
        this.server.to(room).emit('message', data);
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

    @SubscribeMessage('updateUserState')
    async updateUserState(
        @MessageBody() body: { name: string; state: string; contact?: string },
    ) {
        this.server.emit('contactStateChange', body);
        await this.socketService.updateUserState(body.name, body.state);
    }
}
