import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import ApiError from '../utils/ApiError.js';

enum validationTarget {
    Params = "params",
    Body = "body",
    Query = "query"
}

const validate = (schema: ZodType, target:  validationTarget = validationTarget.Body) => {
    (req: Request, _res: Response, next: NextFunction) => {
        try {
            const data = req[target];
            const result = schema.safeParse(data);

            if (!result.success) {
                const errors = result.error.issues.map((issue) => {
                    return {path: issue.path.join('.'), message: issue.message}
                });

                return next(new ApiError(400, "Validation error", errors));
            }

            req[target] = result.data;
            next();
        } catch (err) {
            next(err);
        }
    }
}

export default validate