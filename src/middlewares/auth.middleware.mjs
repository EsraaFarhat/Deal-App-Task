import jwt from "jsonwebtoken";
import config from "../config/config.mjs";
import { AppError, UnAuthorizedError } from "../shared/app-error.mjs";
import MESSAGES from "../shared/messages.mjs";
import UsersService from "../services/users.service.mjs";

const jwtSecret = config.privateKey;

/**
 * Middleware function to authenticate the user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {UnAuthorizedError} - If the user is not authenticated.
 * @throws {UnAuthorizedError} - If the token is invalid.
 * @throws {AppError} - If there is an error while authenticating the user.
 * @return {Promise<void>} - Resolves when the user is authenticated.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new UnAuthorizedError(MESSAGES.AUTHENTICATION_FAILED);
    }

    const decodedToken = jwt.verify(token, jwtSecret);

    const user = await UsersService.getOneById(decodedToken.userId);
    if (!user) {
      throw new UnAuthorizedError(MESSAGES.INVALID_TOKEN);
    }

    // Attach the user object to the request for further use in subsequent middleware or routes
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnAuthorizedError(MESSAGES.EXPIRED_TOKEN);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnAuthorizedError(MESSAGES.INVALID_TOKEN);
    }
    throw new AppError(error);
  }
};

export default authMiddleware;
