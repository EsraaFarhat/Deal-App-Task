import express from "express";

import authRoutes from "./auth.routes.mjs";
import propertyRequestsRoutes from "./propertyRequests.routes.mjs";
import adsRoutes from "./ads.routes.mjs";
import usersRoutes from "./users.routes.mjs";

const app = express();

app.use("/auth", authRoutes);
app.use("/propertyRequests", propertyRequestsRoutes);
app.use("/ads", adsRoutes);
app.use("/users", usersRoutes);

export default app;
