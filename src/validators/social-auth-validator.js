import { errorResponse } from "../helpers/response";
import { socialAuthSchema } from "../validation-schemas/social-auth-schema";

const socialAuthValidator = async (req, res, next) => {
  try {
    await socialAuthSchema.validateAsync(req.body);
    return next();
  } catch (error) {
    return errorResponse(res, { statusCode: 422, message: error.message });
  }
};
export { socialAuthValidator };
