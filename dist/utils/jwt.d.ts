import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
export declare const generateToken: (userId: string, expiresIn?: StringValue | number) => string;
export declare const verifyToken: (token: string) => jwt.JwtPayload;
//# sourceMappingURL=jwt.d.ts.map