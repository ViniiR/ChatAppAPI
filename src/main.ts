import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        credentials: true,
        origin: process.env.CLIENT_PAGE_URL,
    });
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}
bootstrap();
