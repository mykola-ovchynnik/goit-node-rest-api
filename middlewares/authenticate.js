import controllerWrapper from '../decorators/controllerWrapper.js';
import HttpError from '../helpers/HttpError.js';
import { verifyToken } from '../helpers/jwt.js';
import { findUser } from '../services/authServices.js';

export const authenticate = controllerWrapper(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw next(HttpError(401, 'Not authorized'));
  }

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    throw next(HttpError(401, 'Bearer not found'));
  }

  const { id } = verifyToken(token);
  const user = await findUser({ _id: id });
  if (!user || !user.token) {
    throw HttpError(401, 'Not authorized');
  }

  req.user = user;
  next();
});
