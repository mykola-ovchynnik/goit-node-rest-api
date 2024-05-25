import User from '../models/User.js';
import bcrypt from 'bcrypt';

const findUser = filter => User.findOne(filter);

const saveUser = async data => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashPassword });
};

const updateUserById = (id, data) => {
  return User.findByIdAndUpdate(id, data);
};

const deleteUsers = filter => {
  return User.deleteMany(filter);
};

export default { findUser, saveUser, updateUserById, deleteUsers };
