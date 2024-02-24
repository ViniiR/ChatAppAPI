"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.getJWTToken = exports.isHashValid = exports.hashString = void 0;
const argon = require("argon2");
const jwt = require("jsonwebtoken");
async function hashString(string) {
    try {
        const hashed = await argon.hash(string);
        return hashed;
    }
    catch (err) {
        console.error(err);
        throw new Error(err);
    }
}
exports.hashString = hashString;
async function isHashValid(originalString, hashedString) {
    try {
        return await argon.verify(hashedString, originalString);
    }
    catch (err) {
        console.error(err);
    }
}
exports.isHashValid = isHashValid;
function getKey() {
    return process.env.SECRET_JWT_KEY;
}
function getJWTToken(userName) {
    return jwt.sign({ userName }, getKey());
}
exports.getJWTToken = getJWTToken;
function verifyJWT(token) {
    try {
        const tokenInfo = jwt.verify(token, process.env.SECRET_JWT_KEY);
        return { isValid: true, userName: tokenInfo.userName };
    }
    catch (err) {
        return { isValid: false, userName: null };
    }
}
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=hashing.js.map