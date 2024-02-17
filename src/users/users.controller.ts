import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './DTO/CreateUser.dto';
import { getJWTToken, hashString, verifyJWT } from 'hashing';
import { Request, Response } from 'express';
import { ContactDTO } from './DTO/ContactDTO';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('create')
    @UsePipes(new ValidationPipe())
    async createUser(@Body() createUserDTO: CreateUserDTO) {
        const hashedUser: CreateUserDTO = {
            userName: createUserDTO.userName,
            password: await hashString(createUserDTO.password),
        };
        return this.usersService.createUser(hashedUser);
    }

    @Get('login')
    async loginUser(
        @Res() res: Response,
        @Query('userInfo') userInfo: CreateUserDTO,
    ) {
        const isUser = await this.usersService.findUser(userInfo);
        if (!isUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const jwt = getJWTToken(userInfo.userName);
        if (!jwt) res.sendStatus(500);
        res.cookie('secret-access-token', jwt, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.sendStatus(200);
    }

    @Get('authorization')
    authorization(@Req() req: Request, @Res() res: Response) {
        const cookie = req.cookies['secret-access-token'];
        if (!req.cookies || !cookie) return res.sendStatus(400);
        const { isValid, userName } = verifyJWT(cookie);
        res.status(isValid ? 200 : 403).send({ currentUserName: userName });
    }

    @Get('info')
    async info(@Req() req: Request, @Res() res: Response) {
        const cookie = req.cookies['secret-access-token'];
        if (!cookie || !req.cookies) return 400;
        const { isValid, userName } = verifyJWT(cookie);
        // use users service to search all of the user's contacts on db
        if (!isValid) return res.sendStatus(403);
        const { isUser, userInfo } =
            await this.usersService.getUserInfo(userName);
        if (!isUser) return res.sendStatus(404);
        return res.status(200).send({ userInfo });
    }

    @Patch('add-contact')
    async addContact(
        @Body() contactDTO: ContactDTO,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const cookie = req.cookies['secret-access-token'];
        const { isValid, userName } = verifyJWT(cookie);
        if (!isValid) return res.sendStatus(403);
        if (!req.cookies || !cookie) return res.sendStatus(400);
        const userExists = await this.usersService.userExists(userName);
        const contactExists = await this.usersService.userExists(
            contactDTO.userName,
        );
        if (!userExists || !contactExists)
            return res.status(400).send("user doesn't exist");
        const result = await this.usersService.addContact(
            userName,
            contactDTO.userName,
        );
        if (result) {
            return res.status(200).send('Friend added successfully');
        }
        return res.status(400).send('Friend already exists');
    }
}
