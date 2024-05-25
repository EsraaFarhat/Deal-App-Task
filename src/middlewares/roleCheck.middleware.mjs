import { AppError, ForbiddenError } from "../shared/app-error.mjs";
import { UserRole } from "../shared/enums.mjs";
import MESSAGES from "../shared/messages.mjs";

/**
 * Middleware function to check the role of the user.
 *
 * @param {Array} roles - An array of allowed roles.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {ForbiddenError} - If the user's role is not admin and not included in the allowed roles.
 * @return {Promise<void>} - Resolves when the user's role is valid.
 */
const checkRole = (roles) => async (req, res, next) => {
  try {
    if (req.user.role != UserRole.ADMIN && !roles.includes(req.user.role)) {
      throw new ForbiddenError(MESSAGES.FORBIDDEN_ERROR);
    }

    next();
  } catch (error) {
    throw new AppError(error);
  }
};

export default checkRole;
