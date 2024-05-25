import { BadRequestError, NotFoundError } from "../shared/app-error.mjs";
import PropertyRequestsService from "../services/propertyRequests.service.mjs";
import MESSAGES from "../shared/messages.mjs";
import { handlePaginationSort, validateObjectId } from "../utils/helpers.mjs";
import { HTTP_CODES } from "../shared/status-codes.mjs";
import { PropertyType } from "../shared/enums.mjs";

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
    let propertyRequest = await PropertyRequestsService.createOne(req.body);

    res.status(HTTP_CODES.SUCCESS.CREATED).send({
      data: propertyRequest,
    });
  }

  static async getAll(req, res) {
    const { skip, limit, sort } = handlePaginationSort(req.query);
    const options = {
      skip,
      limit,
      sort,
    };

    const { propertyType, minPrice, maxPrice, area, city, district } =
      req.query;
    const filters = { userId: req.user._id };
    if (propertyType) {
      if(!Object.values(PropertyType).includes(propertyType)) {
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

    const propertyRequest = await PropertyRequestsService.getOneById(id, [
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
