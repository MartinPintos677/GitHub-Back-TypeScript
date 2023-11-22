import express from "express";
import { Router } from "express";
import * as userController from "../controllers/userController";
import * as authController from "../controllers/authController";
import authenticateUser from "../Auth/authenticateUser";

const router: Router = express.Router();

// Rutas relacionadas a los usuarios:

router.post("/login", authController.loginUser);
router.post("/user", authController.registerUser);

// Middleware de autenticación para las rutas protegidas
router.use(authenticateUser);

router.get("/user", userController.index);
router.get("/user/:username", userController.show);
router.patch("/user/:username", userController.update);
router.delete("/user/:username", userController.destroy);
router.get("/logout", authController.logout);

export default router;
