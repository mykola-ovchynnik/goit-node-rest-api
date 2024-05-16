import express from 'express';
import isBodyEmpty from '../middlewares/isBodyEmpty.js';
import validateBody from '../middlewares/validateBody.js';
import {
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
} from '../controllers/authController.js';
import {
  createUserAuthSchema,
  loginUserSchema,
  updateSubscriptionSchema,
} from '../schemas/AuthSchema.js';
import { authenticate } from '../middlewares/authenticate.js';

const authRouter = express.Router();

authRouter.post('/register', isBodyEmpty, validateBody(createUserAuthSchema), register);

authRouter.post('/login', isBodyEmpty, validateBody(loginUserSchema), login);

authRouter.post('/logout', authenticate, logout);

authRouter.get('/current', authenticate, getCurrent);

authRouter.patch(
  '/',
  authenticate,
  isBodyEmpty,
  validateBody(updateSubscriptionSchema),
  updateSubscription
);

export default authRouter;
