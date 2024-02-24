import * as argon from 'argon2';
import * as jwt from 'jsonwebtoken';

export async function hashString(string: string): Promise<string> {
    try {
        const hashed = await argon.hash(string);
        return hashed;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

export async function isHashValid(
    originalString: string,
    hashedString: string,
): Promise<boolean> {
    try {
        return await argon.verify(hashedString, originalString);
    } catch (err) {
        console.error(err);
    }
}

function getKey(): string {
    return process.env.SECRET_JWT_KEY;
}

export function getJWTToken(userName: string) {
    return jwt.sign({ userName }, getKey());
}

export function verifyJWT(token: string): {
    isValid: boolean;
    userName: string | null;
} {
    try {
        const tokenInfo: { userName: string; iat: number } = jwt.verify(
            token,
            process.env.SECRET_JWT_KEY,
        ) as { userName: string; iat: number };
        return { isValid: true, userName: tokenInfo.userName };
    } catch (err) {
        return { isValid: false, userName: null };
    }
}
