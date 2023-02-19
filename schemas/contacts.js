const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().min(6).required().email(),
  phone: Joi.string().min(10).required(),
  favorite: Joi.bool(),
});

const favoriteSchema = Joi.object({
  favorite: Joi.bool().required(),
});

module.exports = {
  favoriteSchema,
  addContactSchema,
};
