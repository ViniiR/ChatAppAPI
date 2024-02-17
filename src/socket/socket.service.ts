import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
    private readonly connectedClients: Map<string, Socket> = new Map();
    handleConnection(socket: Socket) {
        const clientId = socket.id;
        socket.on('disconnect', () => {
            this.connectedClients.delete(clientId);
        });
    }
    handleMessage(socket: Socket, message) {
        //
    }
}
