import jwt from 'jsonwebtoken'
import type { JwtPayload,SignOptions } from 'jsonwebtoken'
import type { StringValue } from 'ms'
import { JWT_SECRET } from '../config/env.js'
import ApiError from './ApiError.js';

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
    try {
        if (!JWT_SECRET) throw new Error("JWT_SECRET not defined")

        const decoded = jwt.verify(token, JWT_SECRET)

        if (typeof decoded === "string" || !decoded) {
            throw new ApiError(401, "invalid jwt token");
        }

        return decoded;
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            throw new ApiError(401, "Token expired", err);
        }
        else if (err instanceof jwt.JsonWebTokenError) {
            throw new ApiError(401, "invalid authentication token");
        }
        throw new Error("Internal server error");
    }
}