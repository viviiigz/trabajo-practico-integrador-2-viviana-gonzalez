import { body } from "express-validator";

export const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("El campo name es obligatorio"),
  body("lastname")
    .notEmpty()
    .withMessage("El campo lastname es obligatorio"),
  body("username")
    .notEmpty()
    .withMessage("El campo username es obligatorio"),
  body("email")
    .isEmail()
    .withMessage("El campo email debe ser un email válido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("El password debe tener al menos 6 caracteres"),
];

export const loginValidation = [
  body("username")
    .notEmpty()
    .withMessage("El campo username es obligatorio"),
  body("password")
    .notEmpty()
    .withMessage("El campo password es obligatorio"),
];
