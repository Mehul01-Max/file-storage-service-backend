import type {Request, Response, NextFunction} from 'express'
import ApiError from '../utils/ApiError.js';
import { verifyToken } from '../utils/jwt.js';


const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            throw new ApiError(400, "authorization header not present");
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            throw new ApiError(400, "token not present");
        }

        const verify = verifyToken(token);

        req.userId = verify.userId;
        next();
    } catch (err) { 
        next(err);
    }
    
}

export default authMiddleware;