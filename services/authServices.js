import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const findUser = filter => User.findOne(filter);

export const saveUser = async body => {
  const hashPassword = await bcrypt.hash(body.password, 10);
  return User.create({ ...body, password: hashPassword });
};
