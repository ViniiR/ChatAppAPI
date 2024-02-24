export declare function hashString(string: string): Promise<string>;
export declare function isHashValid(originalString: string, hashedString: string): Promise<boolean>;
export declare function getJWTToken(userName: string): string;
export declare function verifyJWT(token: string): {
    isValid: boolean;
    userName: string | null;
};
