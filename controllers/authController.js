import controllerWrapper from '../decorators/controllerWrapper.js';
import HttpError from '../helpers/HttpError.js';
import { findUser, saveUser } from '../services/authServices.js';

export const signup = controllerWrapper(async (req, res) => {
  const user = await findUser({ email: req.body.email });
  if (user) {
    throw HttpError(409, 'Email in use!');
  }

  const newUser = await saveUser(req.body);

  res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription } });
});
