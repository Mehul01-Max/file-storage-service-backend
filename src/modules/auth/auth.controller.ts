import type { Request, Response, NextFunction } from 'express'
import * as authService from './auth.service.js';
import { successReponse } from '../../utils/apiResponse.js';


export const register = async (req : Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body;
        const result = await authService.register(email, password, name);
        return successReponse(res, "user successfully created", result, 201);
    } catch (err) {
        next(err);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        return successReponse(res, "user successfully signed In", result, 200);
    } catch (err) {
        next(err);
    }
}