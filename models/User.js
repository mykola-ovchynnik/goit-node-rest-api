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
    avatarURL: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  { versionKey: false, timestamps: true }
);

authUserSchema.post('save', handleSaveError);

authUserSchema.pre('findOneAndUpdate', setUpdateOptions);

authUserSchema.post('findOneAndUpdate', handleSaveError);

const User = model('user', authUserSchema);

export default User;
