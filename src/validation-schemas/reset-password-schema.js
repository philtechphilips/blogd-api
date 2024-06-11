import Joi from "joi";

const resetPasswordSchema = Joi.object({
    token: Joi.string().min(3).required(),
    new_password: Joi.string().min(3).required(),
})
export {
    resetPasswordSchema
}