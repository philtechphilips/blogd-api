import { errorResponse } from "../helpers/response";
import { resetPasswordSchema } from "../validation-schemas/reset-password-schema";

const resetPasswordValidator = async (req, res, next) => {
    try {
        await resetPasswordSchema.validateAsync(req.body);

        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
};
export {
    resetPasswordValidator
}