import { PropertyType } from "./enums.mjs";

const MESSAGES = {
  BAD_REQUEST_ERROR: "Bad request",
  CONFLICT_ERROR: "Conflict",
  FORBIDDEN_ERROR: "Forbidden",
  INTERNAL_SERVER_ERROR: "Internal server error",
  NOT_FOUND_ERROR: "Not found",
  RESPONSE_OK: "Success",
  UNAUTHORIZED_ERROR: "Unauthorized",
  UNPROCESSABLE_ENTITY_ERROR: "Unprocessable entity",

  INVALID_CREDENTIALS: "Invalid phoneNumber or password",
  AUTHENTICATION_FAILED: "Unable to authenticate",
  EXPIRED_TOKEN: "Token has expired",
  INVALID_TOKEN: "Invalid token",
  
  PROPERTY_REQUEST_NOT_FOUND: "There is no property request with entered id",
  INVALID_PROPERTY_REQUEST_ID: "Invalid property request id",
  INVALID_PROPERTY_TYPE: `Property type should be one of ${Object.values(PropertyType)}`,

  AD_NOT_FOUND: "There is no ad with entered id",
  INVALID_AD_ID: "Invalid ad id",

  USER_NOT_FOUND: "There is no user with entered id",
  INVALID_USER_ID: "Invalid user id",
};

export default MESSAGES;
