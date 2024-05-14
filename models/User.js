import e from 'cors';
import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateOptions } from './hooks.js';
import { subscriptionTypes } from '../constants/authConstants.js';

const authUserSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptionTypes,
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

authUserSchema.post('save', handleSaveError);

authUserSchema.pre('findOneAndUpdate', setUpdateOptions);

authUserSchema.post('findOneAndUpdate', handleSaveError);

const User = model('User', authUserSchema);

export default User;
