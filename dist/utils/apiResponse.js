export const successReponse = (res, message, data, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data: data ?? null
    });
};
//# sourceMappingURL=apiResponse.js.map