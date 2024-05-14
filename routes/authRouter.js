import express from 'express';
import isBodyEmpty from '../middlewares/isBodyEmpty.js';
import validateBody from '../middlewares/validateBody.js';
import { signup } from '../controllers/authController.js';
import { createUserAuthSchema } from '../schemas/AuthSchema.js';

const authRouter = express.Router();

authRouter.post('/register', isBodyEmpty, validateBody(createUserAuthSchema), signup);

export default authRouter;
