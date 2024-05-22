import jwt from "jsonwebtoken";
import _ from "lodash";

import config from "../config/config.mjs";
import UsersService from "../services/users.service.mjs";
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
} from "../shared/app-error.mjs";
import MESSAGES from "../shared/messages.mjs";
import { generateToken } from "../utils/helpers.mjs";
import { HTTP_CODES } from "../shared/status-codes.mjs";

const jwtSecret = config.privateKey;
export default class UsersController {
  // Function to login
  static async login(req, res) {
    try {
      const { error } = UsersService.userLoginSchema(req.body);
      if (error) {
        throw new BadRequestError(error.details[0].message);
      }

      let user = await UsersService.getUser({
        phoneNumber: req.body.phoneNumber,
      });
      if (!user || !(await user.comparePassword(req.body.password))) {
        throw new UnauthorizedError(MESSAGES.INVALID_CREDENTIALS);
      }

      // Generate and sign the JWT token that expires in one day
      const token = generateToken({ userId: user._id })
      
      res.send({
        statusCode: HTTP_CODES.SUCCESS.OK,
        user:
          typeof user._id === "object"
            ? _.omit(user.toObject(), ["password"])
            : _.omit(user, ["password"]),
        token,
      });
    } catch (error) {
      throw new AppError(error);
    }
  }
}
