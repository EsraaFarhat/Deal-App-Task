import {
  AppError,
  ForbiddenError,
} from "../shared/app-error.mjs";
import { UserRole } from "../shared/enums.mjs";
import MESSAGES from "../shared/messages.mjs";

const checkRole =  (roles) => async (req, res, next) => {
  try {
    
    if(req.user.role != UserRole.ADMIN && !roles.includes(req.user.role)){
      throw new ForbiddenError(MESSAGES.FORBIDDEN_ERROR);
    }

    next();
  } catch (error) {
    throw new AppError(error);
  }
};

export default checkRole;
