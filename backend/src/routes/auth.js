import express from "express";
import { AuthController } from "../controllers/AuthController.js";
const router = express.Router();

const authController = new AuthController()

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;