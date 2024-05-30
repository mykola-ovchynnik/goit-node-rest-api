import jwt from 'jsonwebtoken';
import HttpError from './HttpError.js';
import 'dotenv/config.js';

const { JWT_SECRET } = process.env;

export const createToken = payload =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });

export const verifyToken = token => {
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);

    return decodedToken;
  } catch (error) {
    throw HttpError(401, 'Not authorized');
  }
};
