export default class ApiError extends Error {
    statusCode: number;
    errors?: any;
    constructor(statusCode: number, message: string, errors?: any);
}
//# sourceMappingURL=ApiError.d.ts.map