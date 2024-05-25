import Joi from "joi";

import AdsEntity from "../models/ads.model.mjs";
import { PropertyType } from "../shared/enums.mjs";

export default class AdsService {
  /**
   * Retrieves a single ad from the database by its ID.
   *
   * @param {string} id - The ID of the ad to retrieve.
   * @param {string} projection - The fields to include or exclude from the retrieved ad.
   * @param {object} options - Additional options for the query.
   * @return {Promise<object>} A promise that resolves to the retrieved ad object.
   */
  static async getOneById(id, projection, options) {
    const ad = await AdsEntity.findById(id, projection, options);
    return ad;
  }

  /**
   * Retrieves a single ad from the database based on the provided filters, projection, and options.
   *
   * @param {Object} filters - The filters to apply when querying the database.
   * @param {string} projection - The fields to include or exclude from the retrieved ad.
   * @param {Object} options - Additional options for the query.
   * @return {Promise<Object>} A promise that resolves to the retrieved ad object.
   */
  static async getOne(filters, projection, options) {
    const ad = await AdsEntity.findOne(filters, projection, options);
    return ad;
  }

  /**
   * Retrieves all ads from the database based on the provided filters, projection, and options.
   *
   * @param {Object} filters - The filters to apply when querying the database.
   * @param {string} projection - The fields to include or exclude from the retrieved ads.
   * @param {Object} options - Additional options for the query.
   * @return {Promise<Array<Object>>} A promise that resolves to an array of ad objects.
   */
  static async getAll(filters, projection, options) {
    const ads = await AdsEntity.find(filters, projection, options);
    return ads;
  }

  /**
   * Creates a new ad in the database.
   *
   * @param {Object} body - The data for the new ad.
   * @return {Promise<Object>} A promise that resolves to the newly created ad object.
   */
  static async createOne(body) {
    let addedAd = new AdsEntity(body);
    addedAd = addedAd.save();

    return addedAd;
  }

  /**
   * Updates a single ad in the database based on the provided filters and body.
   *
   * @param {Object} filters - The filters to apply when querying the database.
   * @param {Object} body - The updated ad data.
   * @return {Promise<Object>} A promise that resolves to the updated ad object.
   */
  static async updateOne(filters, body) {
    const updatedAd = await AdsEntity.findOneAndUpdate(filters, body, {
      new: true,
    });
    return updatedAd;
  }

  /**
   * Aggregates the ads based on the provided pipeline.
   *
   * @param {Array<Object>} pipeline - The pipeline to apply to the ads collection.
   * @return {Promise<Array<Object>>} A promise that resolves to the aggregated ads.
   */
  static async aggregate(pipeline) {
    const ads = await AdsEntity.aggregate(pipeline);
    return ads;
  }

  /**
   * Asynchronously counts the number of documents in the AdsEntity collection that match the given filters.
   *
   * @param {Object} filters - The filters to apply to the count operation.
   * @return {Promise<number>} A promise that resolves to the count of documents that match the filters.
   */
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
