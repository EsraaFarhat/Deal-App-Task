import { Router } from "express";
import asyncWrapper from "../shared/async-wrapper.mjs";
import PropertyRequestsController from "../controllers/propertyRequests.controller.mjs";
import authMiddleware from "../middlewares/auth.middleware.mjs";
import checkRole from "../middlewares/roleCheck.middleware.mjs";
import { UserRole } from "../shared/enums.mjs";

const propertyRequestsRoutes = Router();

propertyRequestsRoutes.use(
  asyncWrapper(authMiddleware),
  asyncWrapper(checkRole([UserRole.CLIENT]))
);

propertyRequestsRoutes
  .route("/")
  // Route to create a new propertyRequest
  .post(asyncWrapper(PropertyRequestsController.createOne))
  // Route to get all propertyRequests
  .get(asyncWrapper(PropertyRequestsController.getAll));

propertyRequestsRoutes
  .route("/:id")
  // Route to update a propertyRequest by Id
  .put(asyncWrapper(PropertyRequestsController.updateOne));

export default propertyRequestsRoutes;
