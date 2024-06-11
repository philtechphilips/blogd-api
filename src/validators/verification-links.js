import { errorResponse } from "../helpers/response";
import { resendVerificationLinkSchema } from "../validation-schemas/verification-links-schema";

const resendVerificationLinkValidator = async (req, res, next) => {
    try {
        await resendVerificationLinkSchema.validateAsync(req.body);

        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
};
export {
    resendVerificationLinkValidator
}