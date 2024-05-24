import { Router } from "express";
import asyncWrapper from "../shared/async-wrapper.mjs";
import authController from "../controllers/auth.controller.mjs";

const authRoutes = Router();

// Route to login
authRoutes.route("/login").post(asyncWrapper(authController.login));

export default authRoutes;
