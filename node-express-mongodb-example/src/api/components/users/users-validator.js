const joi = require('joi');
const { changePasswordSchema } = require('./users-service');

module.exports = {
  createUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joi.string().min(6).max(32).required().label('Password'),
      password_confirm: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('Password Confirm'),
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  changePasswordSchema: {
    body: {
      oldPassword: joi.string().required().label('Old Password'),
      newPassword: joi.string().min(6).max(32).required().label('New Password'),
      confirmPassword: joi
        .string()
        .min(6)
        .max(32)
        .require()
        .label('Confirm New Password'),
    },
  },
};
