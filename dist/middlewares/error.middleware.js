import ApiError from '../utils/ApiError.js';
const errorMiddleware = (err, _req, res, _next) => {
    console.error(err);
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || null,
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal server Error"
    });
};
export default errorMiddleware;
//# sourceMappingURL=error.middleware.js.map