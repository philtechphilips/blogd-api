import { errorResponse } from "../helpers/response";
import { loginSchema } from "../validation-schemas/login-schema";

const loginValidator = async (req, res, next) => {
    try {
        await loginSchema.validateAsync(req.body);

        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
};
export {
    loginValidator
}