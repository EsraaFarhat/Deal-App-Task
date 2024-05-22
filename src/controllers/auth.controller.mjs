import _ from "lodash";

import UsersService from "../services/users.service.mjs";
import {
  AppError,
  BadRequestError,
  UnAuthorizedError,
} from "../shared/app-error.mjs";
import MESSAGES from "../shared/messages.mjs";
import { generateToken } from "../utils/helpers.mjs";

export default class UsersController {
  // Function to login
  static async login(req, res) {
    try {
      const { error } = UsersService.userLoginSchema(req.body);
      if (error) {
        throw new BadRequestError(error.details[0].message);
      }

      let user = await UsersService.getUser(
        {
          phoneNumber: req.body.phoneNumber,
        },
        "-__v -createdAt -updatedAt"
      );

      if (!user || !(await user.comparePassword(req.body.password))) {
        throw new UnAuthorizedError(MESSAGES.INVALID_CREDENTIALS);
      }

      // Generate and sign the JWT token that expires in one day
      const token = generateToken({ userId: user._id });

      res.send({
        data: {
          user:
            typeof user._id === "object"
              ? _.omit(user.toObject(), ["password"])
              : _.omit(user, ["password"]),
          token,
        },
        error: null,
      });
    } catch (error) {
      throw new AppError(error);
    }
  }
}
