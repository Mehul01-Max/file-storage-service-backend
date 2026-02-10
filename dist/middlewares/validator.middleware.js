import ApiError from '../utils/ApiError.js';
var validationTarget;
(function (validationTarget) {
    validationTarget["Params"] = "params";
    validationTarget["Body"] = "body";
    validationTarget["Query"] = "query";
})(validationTarget || (validationTarget = {}));
const validate = (schema, target = validationTarget.Body) => {
    return (req, _res, next) => {
        try {
            const data = req[target];
            const result = schema.safeParse(data);
            if (!result.success) {
                const errors = result.error.issues.map((issue) => {
                    return { path: issue.path.join('.'), message: issue.message };
                });
                return next(new ApiError(400, "Validation error", errors));
            }
            req[target] = result.data;
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
export default validate;
//# sourceMappingURL=validator.middleware.js.map