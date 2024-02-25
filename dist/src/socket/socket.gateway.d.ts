import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
export declare class SocketGateway {
    private readonly socketService;
    constructor(socketService: SocketService);
    server: Server;
    handleMessage(data: {
        owner: string;
        sentTo: string;
        content: string;
        currentTime: string;
    }): Promise<void>;
    handleJoinRoom(client: Socket, data: {
        client1: string;
        client2: string;
    }): Promise<void>;
    updateUserState(body: {
        name: string;
        state: string;
        contact?: string;
    }): Promise<void>;
}
