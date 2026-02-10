import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
export const generateToken = (userId, expiresIn = "7D") => {
    if (!JWT_SECRET)
        throw new Error("JWT_SECRET not defined");
    const payload = { userId };
    const options = { expiresIn };
    return jwt.sign(payload, JWT_SECRET, options);
};
export const verifyToken = (token) => {
    if (!JWT_SECRET)
        throw new Error("JWT_SECRET not defined");
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string" || !decoded) {
        throw new Error("invalid jwt token");
    }
    return decoded;
};
//# sourceMappingURL=jwt.js.map