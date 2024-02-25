import {
    Body,
    Controller,
    Delete,
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
            onlineState: 'Online',
        };
        return await this.usersService.createUser(hashedUser);
    }

    @Get('login')
    async loginUser(
        @Res() res: Response,
        @Query('userInfo') userInfo: CreateUserDTO,
    ) {
        const isUser = await this.usersService.findUser(userInfo);
        if (!isUser) {
            throw new HttpException('User not found', HttpStatus.FORBIDDEN);
        }
        const jwt = getJWTToken(userInfo.userName);
        if (!jwt) res.sendStatus(500);
        res.cookie('secret-access-token', jwt, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'none',
        });
        return res.sendStatus(200);
    }

    @Get('authorization')
    async authorization(@Req() req: Request, @Res() res: Response) {
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

    @Get('friend-info')
    async getFriendInfo(
        @Query('userName') userName: string,
        @Res() res: Response,
    ) {
        if (!userName) {
            return res.sendStatus(400);
        }
        const isOnline = await this.usersService.getStatus(userName);
        if (isOnline == null) {
            return res.sendStatus(404);
        }
        return res
            .status(200)
            .send({ userName: isOnline.userName, state: isOnline.state });
    }

    @Patch('add-contact')
    async addContact(
        @Body() contactDTO: ContactDTO,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const cookie = req.cookies['secret-access-token'];
        const { isValid, userName } = verifyJWT(cookie);
        if (!isValid) {
            return res.sendStatus(403);
        }
        if (!req.cookies || !cookie) {
            return res.sendStatus(400);
        }
        const userExists = await this.usersService.userExists(userName);
        const contactExists = await this.usersService.userExists(
            contactDTO.userName,
        );
        if (!userExists || !contactExists) {
            return res.status(400).send("user doesn't exist");
        }
        const result = await this.usersService.addContact(
            userName,
            contactDTO.userName,
        );
        if (result) {
            return res.status(200).send('Friend added successfully');
        }
        return res.status(400).send('Friend already exists');
    }

    @Patch('remove-friend')
    async methodName(
        @Body() body: { name: string; userName: string },
        @Res() res: Response,
    ) {
        if (!body.userName || !body.name) return res.sendStatus(400);
        if (!(await this.usersService.userExists(body.userName))) {
            return res.sendStatus(403);
        }
        return this.usersService.removeContact(body.userName, body.name, res);
    }

    @Delete('delete-user')
    async deleteUser(
        @Query('userName') userName: string,
        @Res() res: Response,
    ) {
        return await this.usersService.deleteUser(userName, res);
    }

    @Delete('end-session')
    async endSession(@Res() res: Response) {
        res.clearCookie('secret-access-token', {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'none',
        });
        res.sendStatus(204);
    }
}
