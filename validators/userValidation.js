const Joi = require('joi');

exports.registerValidation = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
  address: Joi.string().optional()
});

