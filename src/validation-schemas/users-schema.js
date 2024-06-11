import Joi from "joi";

const createUserSchema = Joi.object({
    fullName: Joi.string().min(3).required(),
    email: Joi.string().email().min(3).required(),
    password: Joi.string().min(3).required(),
})
export {
    createUserSchema
}