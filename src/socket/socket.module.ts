import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
    providers: [SocketGateway],
    // imports: [
    //     ConfigModule.forRoot(),
    //     MongooseModule.forRoot(process.env.SECRET_DATABASE_STRING, {
    //         dbName: process.env.DB_NAME,
    //     }),
    // ],
})
export class SocketModule {}
