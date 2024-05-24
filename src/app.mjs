import express from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";

import "./database/connection.mjs";
import config from "./config/config.mjs";
import AppErrorHandler from "./shared/error-handler.mjs";
import { morganErrorHandler, morganSuccessHandler } from "./config/morgan.mjs";

import authRoutes from "./routes/auth.routes.mjs";
import propertyRequestsRoutes from "./routes/propertyRequests.routes.mjs";
import adsRoutes from "./routes/ads.routes.mjs";

const app = express();

app.use(morganSuccessHandler);
app.use(morganErrorHandler);
app.use(cors());

app.use(helmet());

app.use(express.json({ limit: config.router.limit.request }));
app.use(
  express.urlencoded({
    extended: true,
    limit: config.router.limit.request,
    parameterLimit: config.router.limit.parameter,
  })
);

app.use(compression());

app.use("/api/auth", authRoutes);
app.use("/api/propertyRequests", propertyRequestsRoutes);
app.use("/api/ads", adsRoutes);


app.use(AppErrorHandler.errorHandler);

export default app;
