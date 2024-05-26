import controllerWrapper from '../decorators/controllerWrapper.js';
import HttpError from '../helpers/HttpError.js';
import authServices from '../services/authServices.js';
import bcrypt from 'bcrypt';
import { createToken } from '../helpers/jwt.js';
import processAvatar from '../helpers/processAvatar.js';

const register = controllerWrapper(async (req, res) => {
  const user = await authServices.findUser({ email: req.body.email });

  if (user) {
    throw HttpError(409, 'Email in use!');
  }

  const avatarURL = processAvatar.generateAvatar(req.body.email);

  const newUser = await authServices.saveUser({ ...req.body, avatarURL });

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
});

const login = controllerWrapper(async (req, res) => {
  const user = await authServices.findUser({ email: req.body.email });

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const token = createToken({ id: user._id });
  await authServices.updateUserById(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

const logout = controllerWrapper(async (req, res) => {
  await authServices.updateUserById(req.user._id, { token: null });
  res.status(204).end();
});

const getCurrent = controllerWrapper(async (req, res) => {
  res.json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
});

const updateSubscription = controllerWrapper(async (req, res) => {
  const updatedUser = await authServices.updateUserById(req.user._id, {
    subscription: req.body.subscription,
  });
  res.json({
    email: updatedUser.email,
    subscription: updatedUser.subscription,
  });
});

const updateAvatar = controllerWrapper(async (req, res) => {
  if (!req.file) throw HttpError(400, 'Avatar is required');

  const avatarURL = await processAvatar.processAvatar(req.file);

  const updatedUser = await authServices.updateUserById(req.user._id, {
    avatarURL,
  });

  res.json({ avatarURL: updatedUser.avatarURL });
});

export default {
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
  updateAvatar,
};
