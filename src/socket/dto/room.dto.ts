import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {
    @IsNotEmpty()
    @IsString()
    roomName: string;

    messages?: Array<{
        content: string;
        owner: string;
        timestamp: string;
    }>;
}
