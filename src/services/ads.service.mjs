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

  static async getAll(filters, projection, options) {
    const ads = await AdsEntity.find(filters, projection, options);
    return ads;
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

  static async aggregate(pipeline) {
    const ads = await AdsEntity.aggregate(pipeline);
    return ads;
  }

  static async count(filters) {
    const count = await AdsEntity.countDocuments(filters);
    return count;
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
