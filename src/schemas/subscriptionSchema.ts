import joi from 'joi';
export const SubscriptionSchema = joi.object({
    email: joi.string().email().required()
});