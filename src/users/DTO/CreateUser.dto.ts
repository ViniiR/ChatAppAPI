/* eslint-disable indent */
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    userName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    contacts?: Array<string>;

    onlineState?: string;
}
