import { BadRequestError, NotFoundError } from "../shared/app-error.mjs";
import AdsService from "../services/ads.service.mjs";
import MESSAGES from "../shared/messages.mjs";
import { handlePaginationSort, validateObjectId } from "../utils/helpers.mjs";
import { HTTP_CODES } from "../shared/status-codes.mjs";
import PropertyRequestsService from "../services/propertyRequests.service.mjs";
import { PropertyType } from "../shared/enums.mjs";

export default class AdsController {
  // Function to create a new ad
  static async createOne(req, res) {
    const { error } = AdsService.validateCreateAd(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    req.body.userId = req.user._id;
    let ad = await AdsService.createOne(req.body);

    res.status(HTTP_CODES.SUCCESS.CREATED).send({
      data: ad,
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

    const ads = await AdsService.getAll(
      filters,
      "-userId -createdAt -updatedAt -__v",
      options
    );
    const count = await AdsService.count(filters);

    res.send({
      data: {
        rows: ads,
        count,
      },
      error: null,
    });
  }

  static async getAdMatches(req, res) {
    const { id } = req.params;
    let response = validateObjectId(id);
    if (response.error) {
      throw new BadRequestError(MESSAGES.INVALID_AD_ID);
    }

    const ad = await AdsService.getOneById(id, "_id district area price");
    if (!ad) {
      throw new NotFoundError(MESSAGES.AD_NOT_FOUND);
    }

    const { skip, limit } = handlePaginationSort(req.query);

    const priceTolerance = 0.1;
    const minPrice = ad.price * (1 - priceTolerance);
    const maxPrice = ad.price * (1 + priceTolerance);

    const pipeline = [
      {
        $match: {
          district: ad.district,
          price: { $gte: minPrice, $lte: maxPrice },
          area: ad.area,
        },
      },
      { $sort: { refreshedAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          user: { _id: "$user._id", name: "$user.name" },
          propertyType: 1,
          area: 1,
          price: 1,
          city: 1,
          district: 1,
          description: 1,
          refreshedAt: 1,
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          rows: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          count: 1,
          rows: {
            $slice: ["$rows", skip, parseInt(limit)],
          },
        },
      },
    ];

    const [matchingRequests] = await PropertyRequestsService.aggregate(
      pipeline
    );

    if (!matchingRequests) {
      return res.send({
        data: {
          rows: [],
          count: 0,
        },
      });
    }

    res.send({
      data: {
        rows: matchingRequests.rows,
        count: matchingRequests.count,
      },
    });
  }
}
