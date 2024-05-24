import Joi from "joi";

import AdsEntity from "../models/ads.model.mjs";
import { PropertyType } from "../shared/enums.mjs";
import PropertyRequestsEntity from "../models/propertyRequests.model.mjs";

export default class AdsService {
  static async getOneById(id, projection, options) {
    const ad = await AdsEntity.findById(id, projection, options);
    return ad;
  }

  static async getOne(filters, projection, options) {
    const ad = await AdsEntity.findOne(filters, projection, options);
    return ad;
  }

  static async createOne(body) {
    let addedAd = new AdsEntity(body);
    addedAd = addedAd.save();

    return addedAd;
  }

  static async updateOne(filters, body) {
    const updatedAd = await AdsEntity.findOneAndUpdate(filters, body, {
      new: true,
    });
    return updatedAd;
  }

  static async getPropertyRequestsMatchesForAnAd(ad, priceTolerance, options) {
    const minPrice = ad.price * (1 - priceTolerance);
    const maxPrice = ad.price * (1 + priceTolerance);
    
    const matchingRequests = await PropertyRequestsEntity.aggregate([
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
            $slice: ["$rows", options.skip, parseInt(options.limit)],
          },
        },
      },
    ]);

    return matchingRequests;
  }

  static validateCreateAd = (ad) => {
    const schema = Joi.object({
      propertyType: Joi.string()
        .trim()
        .valid(...Object.values(PropertyType))
        .required(),
      area: Joi.string().trim().required(),
      city: Joi.string().trim().required(),
      district: Joi.string().trim().required(),
      price: Joi.number().min(0).required(),
      description: Joi.string().trim(),
    });

    return schema.validate(ad);
  };
}
