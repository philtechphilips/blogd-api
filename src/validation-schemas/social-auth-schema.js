import Joi from "joi";

const socialAuthSchema = Joi.object({
    firstName: Joi.string().email().min(3).required(),
    lastName: Joi.string().email().min(3).required(),
    email: Joi.string().email().min(3).required(),
})
export {
    socialAuthSchema
}