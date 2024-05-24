import { BadRequestError, NotFoundError } from "../shared/app-error.mjs";
import AdsService from "../services/ads.service.mjs";
import MESSAGES from "../shared/messages.mjs";
import { handlePaginationSort, validateObjectId } from "../utils/helpers.mjs";
import { HTTP_CODES } from "../shared/status-codes.mjs";

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
    const options = {
      skip,
      limit,
    };

    const priceTolerance = 0.1;

    const [matchingRequests] =
      await AdsService.getPropertyRequestsMatchesForAnAd(
        ad,
        priceTolerance,
        options
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
