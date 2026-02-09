import type { Request, Response, NextFunction } from 'express'
import ApiError from '../utils/ApiError.js'

const errorMiddleware = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error(err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors|| null,
        });

        
    }
    return res.status(500).json({
        success: false,
        message: "Internal server Error"
    });
}

export default errorMiddleware;
