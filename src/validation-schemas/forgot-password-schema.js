import Joi from "joi";

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().min(3).required(),
})
export {
    forgotPasswordSchema
}