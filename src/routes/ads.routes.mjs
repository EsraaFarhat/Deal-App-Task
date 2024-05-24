import { Router } from "express";
import asyncWrapper from "../shared/async-wrapper.mjs";
import AdsController from "../controllers/ads.controller.mjs";
import authMiddleware from "../middlewares/auth.middleware.mjs";
import checkRole from "../middlewares/roleCheck.middleware.mjs";
import { UserRole } from "../shared/enums.mjs";

const adsRoutes = Router();

adsRoutes.use(asyncWrapper(authMiddleware));

adsRoutes
  .route("/")
  // Route to create a new ad
  .post(
    asyncWrapper(checkRole([UserRole.AGENT])),
    asyncWrapper(AdsController.createOne)
  );

adsRoutes.route("/:id/matches").get(asyncWrapper(AdsController.getAdMatches));

export default adsRoutes;
