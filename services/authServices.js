import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const findUser = filter => User.findOne(filter);

export const saveUser = async data => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashPassword });
};

export const updateUserById = (id, data) => {
  return User.findByIdAndUpdate(id, data);
};

export default { findUser, saveUser, updateUserById };
