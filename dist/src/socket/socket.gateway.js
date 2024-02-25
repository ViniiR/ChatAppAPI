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
exports.SocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const socket_service_1 = require("./socket.service");
let SocketGateway = class SocketGateway {
    constructor(socketService) {
        this.socketService = socketService;
    }
    async handleMessage(data) {
        const room = [data.owner, data.sentTo].sort().join('');
        await this.socketService.saveMessage({
            owner: data.owner,
            content: data.content,
            timestamp: data.currentTime,
        }, room);
        this.server.to(room).emit('message', data);
    }
    async handleJoinRoom(client, data) {
        const room = [data.client1, data.client2].sort().join('');
        client.join(room);
        await this.socketService.createRoom(room);
        const roomExists = await this.socketService.roomExists(room);
        if (roomExists) {
            const messages = await this.socketService.getMessagesFromRoom(room);
            this.server.to(room).emit('roomStoredMessages', messages);
        }
    }
    async updateUserState(body) {
        this.server.emit('contactStateChange', body);
        await this.socketService.updateUserState(body.name, body.state);
    }
};
exports.SocketGateway = SocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateUserState'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "updateUserState", null);
exports.SocketGateway = SocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true, namespace: 'chat' }),
    __metadata("design:paramtypes", [socket_service_1.SocketService])
], SocketGateway);
//# sourceMappingURL=socket.gateway.js.map