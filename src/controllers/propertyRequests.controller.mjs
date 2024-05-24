import { BadRequestError, NotFoundError } from "../shared/app-error.mjs";
import PropertyRequestsService from "../services/propertyRequests.service.mjs";
import MESSAGES from "../shared/messages.mjs";
import { validateObjectId } from "../utils/helpers.mjs";
import { HTTP_CODES } from "../shared/status-codes.mjs";

export default class PropertyRequestsController {
  // Function to create a new propertyRequest
  static async createOne(req, res) {
    const { error } = PropertyRequestsService.validateCreatePropertyRequest(
      req.body
    );
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    req.body.userId = req.user._id;
    let propertyRequest = await PropertyRequestsService.createOne(
      req.body
    );

    res.status(HTTP_CODES.SUCCESS.CREATED).send({
      data: propertyRequest,
    });
  }

  // Function to update propertyRequest by ID
  static async updateOne(req, res) {
    const { id } = req.params;
    let response = validateObjectId(id);
    if (response.error) {
      throw new BadRequestError(MESSAGES.INVALID_PROPERTY_REQUEST_ID);
    }

    const { error } = PropertyRequestsService.validateUpdatePropertyRequest(
      req.body
    );
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const propertyRequest =
      await PropertyRequestsService.getOneById(id, ["_id"]);
    if (!propertyRequest) {
      throw new NotFoundError(MESSAGES.PROPERTY_REQUEST_NOT_FOUND);
    }

    req.body.refreshedAt = new Date();
    let updatedPropertyRequest =
      await PropertyRequestsService.updateOne({ _id: id }, req.body);

    res.send({ data: updatedPropertyRequest });
  }
}
