const mongoose = require("mongoose");
const Joi = require("joi");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      min: 5,
      max: 1024,
    },
  })
);

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().required().min(5).email(),
    name: Joi.string().required().min(5).max(50),
    password: Joi.string().required().min(5).max(255),
  });
  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
