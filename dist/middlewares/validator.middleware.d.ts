import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
declare enum validationTarget {
    Params = "params",
    Body = "body",
    Query = "query"
}
declare const validate: (schema: ZodType, target?: validationTarget) => (req: Request, _res: Response, next: NextFunction) => void;
export default validate;
//# sourceMappingURL=validator.middleware.d.ts.map