import controllerWrapper from '../decorators/controllerWrapper.js';
import HttpError from '../helpers/HttpError.js';
import { findUser, saveUser, updateUserById } from '../services/authServices.js';
import bcrypt from 'bcrypt';
import { createToken } from '../helpers/jwt.js';

export const register = controllerWrapper(async (req, res) => {
  const user = await findUser({ email: req.body.email });

  if (user) {
    throw HttpError(409, 'Email in use!');
  }

  const newUser = await saveUser(req.body);

  res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription } });
});

export const login = controllerWrapper(async (req, res) => {
  const user = await findUser({ email: req.body.email });

  if (!user) {
    throw HttpError(404, 'Email or password is wrong');
  }

  const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

  if (!isPasswordCorrect) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const token = createToken({ id: user._id });
  await updateUserById(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

export const logout = controllerWrapper(async (req, res) => {
  await updateUserById(req.user._id, { token: null });
  res.status(204).end();
});

export const getCurrent = controllerWrapper(async (req, res) => {
  res.json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
});

export const updateSubscription = controllerWrapper(async (req, res) => {
  const updatedUser = await updateUserById(req.user._id, { subscription: req.body.subscription });
  res.json(updatedUser);
});
