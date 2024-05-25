import _ from "lodash";

import UsersService from "../services/users.service.mjs";
import {
  BadRequestError,
  UnAuthorizedError,
} from "../shared/app-error.mjs";
import MESSAGES from "../shared/messages.mjs";
import { generateToken } from "../utils/helpers.mjs";

export default class UsersController {
  /**
   * Logs in a user using their phone number and password.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves when the user is logged in.
   * @throws {BadRequestError} - If the user login data fails validation.
   * @throws {UnAuthorizedError} - If the user credentials are invalid.
   */
  static async login(req, res) {
      const { error } = UsersService.validateUserLogin(req.body);
      if (error) {
        throw new BadRequestError(error.details[0].message);
      }

      let user = await UsersService.getOne(
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
  }
}
