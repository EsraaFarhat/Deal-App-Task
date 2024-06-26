import mongoose from "mongoose";
import config from "../config/config.mjs";
import logger from "../shared/logger.mjs";

// Connect to MongoDB
const db = mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    logger.info("[MongoDB] connected");
  })
  .catch((err) => {
    logger.error(`[MongoDB] Failed to connect: ${err}`);
  });

export { db };
