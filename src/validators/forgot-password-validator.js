import { errorResponse } from "../helpers/response";
import { forgotPasswordSchema } from "../validation-schemas/forgot-password-schema";

const forgotPasswordValidator = async (req, res, next) => {
    try {
        await forgotPasswordSchema.validateAsync(req.body);

        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
};
export {
    forgotPasswordValidator
}