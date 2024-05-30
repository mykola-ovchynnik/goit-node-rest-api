import express from 'express';
import isBodyEmpty from '../middlewares/isBodyEmpty.js';
import validateBody from '../middlewares/validateBody.js';
import authControllers from '../controllers/authController.js';
import authSchemas from '../schemas/AuthSchema.js';
import { authenticate } from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  isBodyEmpty,
  validateBody(authSchemas.createUserAuthSchema),
  authControllers.register
);

authRouter.post(
  '/login',
  isBodyEmpty,
  validateBody(authSchemas.loginUserSchema),
  authControllers.login
);

authRouter.get('/verify/:verificationToken', authControllers.verifyUserEmail);

authRouter.post(
  '/verify',
  isBodyEmpty,
  validateBody(authSchemas.resendVerificationEmailSchema),
  authControllers.resendVerificationEmail
);

authRouter.post('/logout', authenticate, authControllers.logout);

authRouter.get('/current', authenticate, authControllers.getCurrent);

authRouter.patch(
  '/',
  authenticate,
  isBodyEmpty,
  validateBody(authSchemas.updateSubscriptionSchema),
  authControllers.updateSubscription
);

authRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  authControllers.updateAvatar
);

export default authRouter;
