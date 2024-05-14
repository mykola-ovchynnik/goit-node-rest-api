import Joi from 'joi';
import { emailRegExp, subscriptionTypes } from '../constants/authConstants.js';

export const createUserAuthSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().required(),
  subscription: Joi.string().valid(...subscriptionTypes),
});
