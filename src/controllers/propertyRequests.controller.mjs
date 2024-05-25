import { BadRequestError, NotFoundError } from "../shared/app-error.mjs";
import PropertyRequestsService from "../services/propertyRequests.service.mjs";
import MESSAGES from "../shared/messages.mjs";
import { handlePaginationSort, validateObjectId } from "../utils/helpers.mjs";
import { HTTP_CODES } from "../shared/status-codes.mjs";
import { PropertyType, UserRole } from "../shared/enums.mjs";

export default class PropertyRequestsController {
  /**
   * Creates a new property request.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves when the property request is created.
   * @throws {BadRequestError} - If the request body fails validation.
   */
  static async createOne(req, res) {
    const { error } = PropertyRequestsService.validateCreatePropertyRequest(
      req.body
    );
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    req.body.userId = req.user._id;
    let propertyRequest = await PropertyRequestsService.createOne(req.body);

    res.status(HTTP_CODES.SUCCESS.CREATED).send({
      data: propertyRequest,
    });
  }

  /**
   * Retrieves all property requests based on the provided filters, pagination, and sorting options.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves when the property requests are retrieved and sent in the response.
   * @throws {BadRequestError} - If the provided property type is invalid.
   */
  static async getAll(req, res) {
    const { skip, limit } = handlePaginationSort(req.query);
    const options = {
      skip,
      limit,
      sort: { refreshedAt: -1 },
    };

    const { propertyType, minPrice, maxPrice, area, city, district } =
      req.query;

    let filters = {};
    if (req.user.role === UserRole.ADMIN) {
      filters = {};
    } else {
      filters = { userId: req.user._id };
    }

    if (propertyType) {
      if (!Object.values(PropertyType).includes(propertyType)) {
        throw new BadRequestError(MESSAGES.INVALID_PROPERTY_TYPE);
      }
      filters.propertyType = propertyType;
    }
    if (minPrice)
      filters.price = { ...filters.price, $gte: parseFloat(minPrice) };
    if (maxPrice)
      filters.price = { ...filters.price, $lte: parseFloat(maxPrice) };
    if (area) filters.area = area;
    if (city) filters.city = city;
    if (district) filters.district = district;

    const propertyRequests = await PropertyRequestsService.getAll(
      filters,
      "-userId -createdAt -updatedAt -__v",
      options
    );
    const count = await PropertyRequestsService.count(filters);

    res.send({
      data: {
        rows: propertyRequests,
        count,
      },
      error: null,
    });
  }

  /**
   * Updates a property request by ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} A promise that resolves when the property request is updated.
   * @throws {BadRequestError} - If the property request ID is invalid.
   * @throws {BadRequestError} - If the request body fails validation.
   * @throws {NotFoundError} - If the property request is not found.
   */
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

    let filters = {};
    if (req.user.role === UserRole.ADMIN) {
      filters = { _id: id };
    } else {
      filters = { _id: id, userId: req.user._id };
    }
    const propertyRequest = await PropertyRequestsService.getOne(filters, [
      "_id",
    ]);
    if (!propertyRequest) {
      throw new NotFoundError(MESSAGES.PROPERTY_REQUEST_NOT_FOUND);
    }

    req.body.refreshedAt = new Date();
    let updatedPropertyRequest = await PropertyRequestsService.updateOne(
      { _id: id },
      req.body
    );

    res.send({ data: updatedPropertyRequest });
  }
}
