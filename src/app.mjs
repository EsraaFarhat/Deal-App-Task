import express from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import "./database/connection.mjs";
import config from "./config/config.mjs";
import AppErrorHandler from "./shared/error-handler.mjs";
import { morganErrorHandler, morganSuccessHandler } from "./config/morgan.mjs";

import authRoutes from "./routes/auth.routes.mjs";
import propertyRequestsRoutes from "./routes/propertyRequests.routes.mjs";
import adsRoutes from "./routes/ads.routes.mjs";
import usersRoutes from "./routes/users.routes.mjs";
import docs from "./swagger-docs.json" assert { type: "json" };

import './cron/index.mjs';  // Ensure cron jobs are initialized

const app = express();

const options = {
  swaggerDefinition: {
    info: {
      title: "My API",
      version: "1.0.0",
      description: "My API Information",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.mjs"],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serveFiles(docs), swaggerUi.setup(specs));

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
app.use("/api/users", usersRoutes);


app.use(AppErrorHandler.errorHandler);

export default app;
