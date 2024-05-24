/* eslint-disable import/no-extraneous-dependencies */
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { SALT } from "../shared/constants.mjs";
import config from "../config/config.mjs";

export const validateObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    return { error: "Invalid ID!" };
  }
  return {};
};

export const handlePaginationSort = ({
  pageNumber = 1,
  limit = 10,
  order = -1,
  orderBy = "createdAt",
}) => {
  pageNumber = parseInt(pageNumber);
  limit = parseInt(limit);
  if (typeof pageNumber !== "number" || pageNumber < 1) {
    pageNumber = 1;
  }

  if (typeof limit !== "number" || limit < 0) {
    limit = 10;
  }

  const skip = (pageNumber - 1) * limit;

  if (order == "ASC" || order == "asc" || parseInt(order) == 1) {
    order = 1;
  } else {
    order = -1;
  }

  let sort = {};
  sort[`${orderBy}`] = order;
  return { order, skip, orderBy, limit, sort };
};

export const hashString = async (str) => {
  const salt = await bcrypt.genSalt(SALT);
  const hashedScript = await bcrypt.hash(str, salt);
  return hashedScript;
};

export const generateToken = (user, expiresIn = "24h") => {
  return jwt.sign(user, config.privateKey || "secret", { expiresIn });
};
export const comparePassword = async (loginPassword, realPassword) => {
  const isMatched = await bcrypt.compare(loginPassword, realPassword);
  return isMatched;
};
