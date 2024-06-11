import Joi from "joi";

const loginSchema = Joi.object({
    email: Joi.string().email().min(3).required(),
    password: Joi.string().min(3).required(),
})
export {
    loginSchema
}