import { errorResponse } from "../helpers/response";
import { createUserSchema } from "../validation-schemas/users-schema";

const createUserValidator = async (req, res, next) => {
    try {
        await createUserSchema.validateAsync(req.body);

        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
};
export {
    createUserValidator
}