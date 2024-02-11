import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.SECRET_DATABASE_STRING, {
            dbName: process.env.DB_NAME,
        }),
        UsersModule,
    ],
    providers: [AppService],
})
export class AppModule {}
