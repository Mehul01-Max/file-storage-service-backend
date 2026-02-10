import jwt from 'jsonwebtoken'
import type { JwtPayload,SignOptions } from 'jsonwebtoken'
import type { StringValue } from 'ms'
import { JWT_SECRET } from '../config/env.js'

interface TokenPayload extends JwtPayload {
    userId: string;
}

export const generateToken = (userId: string, expiresIn: StringValue | number = "7D") => {
    if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

    const payload: TokenPayload = { userId };
    const options: SignOptions = { expiresIn };

    return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string ) => {
    if (!JWT_SECRET) throw new Error("JWT_SECRET not defined")

    const decoded = jwt.verify(token, JWT_SECRET)

    if (typeof decoded === "string" || !decoded) {
        throw new Error("invalid jwt token");
    }

    return decoded
}