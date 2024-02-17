import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SocketGateway } from './socket/socket.gateway';
import { SocketModule } from './socket/socket.module';
@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.SECRET_DATABASE_STRING, {
            dbName: process.env.DB_NAME,
        }),
        UsersModule,
        SocketModule,
    ],
    providers: [AppService, SocketGateway],
})
export class AppModule {}
