
import { body, param } from "express-validator";
import { TaskModel } from "../../models/task.model.js";

export const createTaskValidations = [
  body("title")
    .notEmpty()
    .withMessage("El campo title es obligatorio")
    .custom(async (value) => {
      const task = await TaskModel.findOne({ where: { title: value } });
      if (task) {
        throw new Error("Ya existe una tarea con ese título");
      }
      return true;
    }),
  body("description")
    .notEmpty()
    .withMessage("El campo description es obligatorio"),
  body("is_completed")
    .optional()
    .isBoolean()
    .withMessage("El campo is_completed debe ser booleano"),
];

export const updateTaskValidations = [
  param("id").isInt().withMessage("ID inválido"),
  body("title")
    .optional()
    .isString()
    .withMessage("El campo title debe ser un string")
    .notEmpty()
    .withMessage("El campo title no puede estar vacío")
    .custom(async (value, { req }) => {
      if (value) {
        const task = await TaskModel.findOne({ where: { title: value } });
        if (task && task.id !== parseInt(req.params.id)) {
          throw new Error("Ya existe una tarea con ese título");
        }
      }
      return true;
    }),
  body("description")
    .optional()
    .isString()
    .withMessage("El campo description debe ser un string")
    .notEmpty()
    .withMessage("El campo description no puede estar vacío"),
  body("is_completed")
    .optional()
    .isBoolean()
    .withMessage("El campo is_completed debe ser booleano"),
];

export const deleteTaskValidations = [
  param("id").isInt().withMessage("ID inválido"),
];
