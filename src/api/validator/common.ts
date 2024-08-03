import Joi from "@hapi/joi";

const loginRegisterValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email is invalid",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().min(8).messages({
    "string.base": "password must be a string",
    "any.required": "password is required",
    "string.min": "password must be 8 characters long",
  }),
});

const requiredStringValidation = (key: string): Joi.StringSchema =>
  Joi.string()
    .required()
    .messages({
      "string.base": `${key} must be a string`,
      "any.required": `${key} is required`,
    });

export { loginRegisterValidation, requiredStringValidation };
