import { isValidObjectId } from 'mongoose';
import HttpError from '../helpers/HttpError.js';

const isValidId = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return next(HttpError(404, 'Id is not valid'));
  }

  next();
};

export default isValidId;
