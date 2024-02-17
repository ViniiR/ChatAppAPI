/* eslint-disable indent */
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ContactDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    userName: string;
}
