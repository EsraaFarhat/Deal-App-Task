import { Router } from "express";
import asyncWrapper from "../shared/async-wrapper.mjs";
import UsersController from "../controllers/auth.controller.mjs";

const usersRoutes = Router();

// Route to login
usersRoutes.route("/login").post(asyncWrapper(UsersController.login));

export default usersRoutes;
