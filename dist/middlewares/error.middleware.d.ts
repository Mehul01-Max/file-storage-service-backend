import type { Request, Response, NextFunction } from 'express';
declare const errorMiddleware: (err: any, _req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>>;
export default errorMiddleware;
//# sourceMappingURL=error.middleware.d.ts.map