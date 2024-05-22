import { Router } from "express";
import asyncWrapper from "../shared/async-wrapper.mjs";
import UsersController from "../controllers/auth.controller.mjs";

const authRoutes = Router();

// Route to login
authRoutes.route("/login").post(asyncWrapper(UsersController.login));

export default authRoutes;
