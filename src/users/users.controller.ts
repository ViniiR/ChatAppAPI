import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
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
        // create jwt or session here, you pick
        //if user found then return 200 and set cookie

        //data sent should be: {
        //userName: nameStr,
        //password: passwordStr,
        //}
        //if found a user whose name is the same in the db,
        //verify the password,
        //if password is valid,
        //returns a response header that sets a http only cookie with a randomly generated jwt token that should be used on all authorization requests
        //jwt should also be encrypted
        if (!jwt) res.sendStatus(500);
        res.cookie('secret-access-token', jwt, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.sendStatus(200);
    }

    @Get('authorization')
    //used automatically by /auth PrivateRoutes component to check if the user is already logged in or not, if returned false | some other kind of err, user should be redirected to /login(it already is, but the system to check for the login is not ready yet)
    //returns a session
    authorization(@Req() req: Request, @Res() res: Response) {
        //checks if sent jwt is valid(somehow, i yet don't know how to either store it or verify so you must learn it)
        //TODO: find a way to send the cookie to the server(here)
        const cookie = req.cookies['secret-access-token'];
        if (!req.cookies || !cookie) return res.sendStatus(400);
        const isValidToken = verifyJWT(cookie);
        res.sendStatus(isValidToken ? 200 : 403);
    }
}
