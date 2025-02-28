const Joi = require("joi");

exports.signupSchema = Joi.object({
  email: Joi.string()
    .min(5)
    .max(60)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    }),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .message(
      "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
    ),
});

exports.signinSchema = Joi.object({
  email: Joi.string()
    .min(5)
    .max(60)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    }),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .message(
      "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
    ),
});
