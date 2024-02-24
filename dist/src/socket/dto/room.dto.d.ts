export declare class CreateRoomDto {
    roomName: string;
    messages?: Array<{
        content: string;
        owner: string;
        timestamp: string;
    }>;
}
