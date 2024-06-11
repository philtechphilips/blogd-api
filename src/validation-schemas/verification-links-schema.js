import Joi from "joi";

const resendVerificationLinkSchema = Joi.object({
    email: Joi.string().email().min(3).required(),
})
export {
    resendVerificationLinkSchema
}