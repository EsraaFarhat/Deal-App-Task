import { BadRequestError, NotFoundError } from "../shared/app-error.mjs";
import AdsService from "../services/ads.service.mjs";
import MESSAGES from "../shared/messages.mjs";
import { validateObjectId } from "../utils/helpers.mjs";
import { HTTP_CODES } from "../shared/status-codes.mjs";

export default class AdsController {
  // Function to create a new ad
  static async createOne(req, res) {
    const { error } = AdsService.validateCreateAd(
      req.body
    );
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    req.body.userId = req.user._id;
    let ad = await AdsService.createOne(
      req.body
    );

    res.status(HTTP_CODES.SUCCESS.CREATED).send({
      data: ad,
    });
  }
}
