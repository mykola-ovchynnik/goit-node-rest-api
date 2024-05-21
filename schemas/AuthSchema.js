import Joi from 'joi';
import { emailRegExp, subscriptionTypes } from '../constants/authConstants.js';

const createUserAuthSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().required(),
  subscription: Joi.string().valid(...subscriptionTypes),
});

const loginUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().required(),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionTypes)
    .required(),
});

export default { createUserAuthSchema, loginUserSchema, updateSubscriptionSchema };
