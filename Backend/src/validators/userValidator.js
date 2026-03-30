import Joi from "joi";

export const userSchema = Joi.object({
  nome: Joi.string().trim().min(2),
  name: Joi.string().trim().min(2),
  cpf: Joi.string().trim().min(11).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).required(),
  telefone: Joi.string().trim().required(),
  endereco: Joi.string().trim().allow(""),
  role: Joi.string().valid("user", "admin").default("user")
}).or("nome", "name");

export const userUpdateSchema = Joi.object({
  nome: Joi.string().trim().min(2),
  cpf: Joi.string().trim().min(11),
  email: Joi.string().trim().lowercase().email(),
  telefone: Joi.string().trim(),
  endereco: Joi.string().trim().allow("")
}).min(1);

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required()
});
