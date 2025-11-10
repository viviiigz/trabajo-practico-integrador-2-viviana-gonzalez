import { Router } from "express";
import {
  login,
  logout,
  profile,
  register,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { loginValidation, registerValidation } from "../middlewares/validations/auth.validations.js";
import { validator } from "../middlewares/validator.middleware.js";
export const authRoutes = Router();

// loguearse
authRoutes.post("/login", loginValidation, validator, login);

// registrarse
authRoutes.post("/register", registerValidation, validator, register);

// ver perfil del logueado
authRoutes.get("/profile", authMiddleware, profile);

// desloguearse
authRoutes.post("/logout", authMiddleware, logout);
