// import { InternalServerError, NotFoundError } from "../shared/app-error.mjs";
import { HTTP_CODES } from './status-codes.mjs';
import MESSAGES from './messages.mjs';

export default class AppErrorHandler {
  static async errorHandler(
    err,
    req,
    res,
    next,
  ) {
    const lang = req.headers['accept-language'] || 'en';

    let message = err.message || err.error || err;
    if (err.message) {
      message = err.message[lang] || err.message;
    } else if (err.error) {
      message = err.error[lang] || err.error;
    } else if (err) {
      message = err[lang] || err;
    }
    res.status(err.statusCode || HTTP_CODES.SERVER.INTERNAL).json({
      data: null,
      error: message || MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
}