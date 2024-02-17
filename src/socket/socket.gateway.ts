import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true, namespace: 'chat' })
export class SocketGateway {
    @WebSocketServer() server: Server;
    @SubscribeMessage('message')
    handleMessage(
        @MessageBody()
        data: {
            user1: string;
            user2: string;
            messageData: string;
        },
    ) {
        const room = [data.user1, data.user2].sort().join('');
        this.server.to(room).emit('message', data.messageData);
        //generate time stamp here or in client
        //save into db
    }
    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, data: { client1: string; client2: string }) {
        const room = [data.client1, data.client2].sort().join('');
        client.join(room);
    }
}
