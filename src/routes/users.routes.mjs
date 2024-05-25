import { Router } from "express";
import asyncWrapper from "../shared/async-wrapper.mjs";
import UsersController from "../controllers/users.controller.mjs";
import authMiddleware from "../middlewares/auth.middleware.mjs";
import checkRole from "../middlewares/roleCheck.middleware.mjs";
import { UserRole } from "../shared/enums.mjs";

const usersRoutes = Router();

usersRoutes.use(asyncWrapper(authMiddleware));

usersRoutes
  .route("/statistics")
  // Route to get user statistics
  .get(
    asyncWrapper(checkRole([UserRole.ADMIN])),
    asyncWrapper(UsersController.getStatistics)
  );

export default usersRoutes;
