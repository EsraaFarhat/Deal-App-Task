import MESSAGES from "./messages.mjs";
import { HTTP_CODES } from './status-codes.mjs';

export class NotFoundError extends Error {
  statusCode;

  constructor(message = MESSAGES.NOT_FOUND_ERROR) {
    super(message);
    this.statusCode = HTTP_CODES.CLIENT.NOT_FOUND;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class BadRequestError extends Error {
  statusCode;

  constructor(message = MESSAGES.BAD_REQUEST_ERROR) {
    super(message);
    this.statusCode = HTTP_CODES.CLIENT.BAD_REQUEST;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UnprocessableEntityError extends Error {
  statusCode;

  constructor(message = MESSAGES.UNPROCESSABLE_ENTITY_ERROR) {
    super(message);
    this.statusCode = HTTP_CODES.CLIENT.UNPROCESSABLE_ENTITY;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
export class UnAuthorizedError extends Error {
  statusCode;

  constructor(message = MESSAGES.UNAUTHORIZED_ERROR) {
    super(message);
    this.statusCode = HTTP_CODES.CLIENT.UNAUTHORIZED;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ForbiddenError extends Error {
  statusCode;
  constructor(message = MESSAGES.FORBIDDEN_ERROR) {
    super(message);
    this.statusCode = HTTP_CODES.CLIENT.FORBIDDEN;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class AppError extends Error {
  statusCode;

  constructor(err = MESSAGES.INTERNAL_SERVER_ERROR) {
    super(err.message || MESSAGES.INTERNAL_SERVER_ERROR);
    this.statusCode = err.statusCode || 500;
  }
}