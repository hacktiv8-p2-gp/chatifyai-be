const Joi = require("joi"); // CommonJS

const authValidation = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // tlds false agar tidak dibatasi ke .com/.net saja
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "string.empty": "Email is required",
    }),

  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:'\",.<>/?]).{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and include lowercase, uppercase, number, and special character",
      "string.empty": "Password is required",
    }),
});

module.exports = {
  authValidation,
};
