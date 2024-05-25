import Joi from "joi";

import PropertyRequestsEntity from "../models/propertyRequests.model.mjs";
import { PropertyType } from "../shared/enums.mjs";

export default class PropertyRequestsService {
  /**
   * Retrieves a property request from the database by its ID.
   *
   * @param {string} id - The ID of the property request to retrieve.
   * @param {string} projection - The fields to include or exclude from the retrieved property request.
   * @param {object} options - Additional options for the query.
   * @return {Promise<object>} A promise that resolves to the retrieved property request object.
   */
  static async getOneById(id, projection, options) {
    const propertyRequest = await PropertyRequestsEntity.findById(
      id,
      projection,
      options
    );
    return propertyRequest;
  }

  /**
   * Retrieves a single property request from the database based on the provided filters, projection, and options.
   *
   * @param {Object} filters - The filters to apply when querying the database.
   * @param {string} projection - The fields to include or exclude from the retrieved property request.
   * @param {Object} options - Additional options for the query.
   * @return {Promise<Object>} A promise that resolves to the retrieved property request object.
   */
  static async getOne(filters, projection, options) {
    const propertyRequest = await PropertyRequestsEntity.findOne(
      filters,
      projection,
      options
    );
    return propertyRequest;
  }

  /**
   * Retrieves all property requests from the database based on the provided filters, projection, and options.
   *
   * @param {Object} filters - The filters to apply when querying the database.
   * @param {string} projection - The fields to include or exclude from the retrieved property requests.
   * @param {Object} options - Additional options for the query.
   * @return {Promise<Array<Object>>} A promise that resolves to an array of property request objects.
   */
  static async getAll(filters, projection, options) {
    const propertyRequests = await PropertyRequestsEntity.find(
      filters,
      projection,
      options
    );
    return propertyRequests;
  }

  /**
   * Creates a new property request in the database.
   *
   * @param {Object} body - The data for the new property request.
   * @return {Promise<Object>} A promise that resolves to the newly created property request object.
   */
  static async createOne(body) {
    let addedPropertyRequest = new PropertyRequestsEntity(body);
    addedPropertyRequest = addedPropertyRequest.save();

    return addedPropertyRequest;
  }

  /**
   * Updates a property request in the database based on the provided filters and body.
   *
   * @param {Object} filters - The filters to apply when querying the database.
   * @param {Object} body - The updated property request data.
   * @return {Promise<Object>} A promise that resolves to the updated property request object.
   */
  static async updateOne(filters, body) {
    const updatedPropertyRequest =
      await PropertyRequestsEntity.findOneAndUpdate(filters, body, {
        new: true,
      });
    return updatedPropertyRequest;
  }

  /**
   * Aggregates the property requests based on the provided pipeline.
   *
   * @param {Array<Object>} pipeline - The pipeline to apply to the property requests collection.
   * @return {Promise<Array<Object>>} A promise that resolves to the aggregated property requests.
   */
  static async aggregate(pipeline) {
    const propertyRequests = await PropertyRequestsEntity.aggregate(pipeline);
    return propertyRequests;
  }

  /**
   * Asynchronously counts the number of documents in the PropertyRequestsEntity collection that match the given filters.
   *
   * @param {Object} filters - The filters to apply to the count operation.
   * @return {Promise<number>} A promise that resolves to the count of documents that match the filters.
   */
  static async count(filters) {
    const count = await PropertyRequestsEntity.countDocuments(filters);
    return count;
  }

  static validateCreatePropertyRequest = (propertyRequest) => {
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

    return schema.validate(propertyRequest);
  };

  static validateUpdatePropertyRequest = (propertyRequest) => {
    const schema = Joi.object({
      area: Joi.string().trim(),
      price: Joi.number().min(0),
      description: Joi.string().trim(),
    });

    return schema.validate(propertyRequest);
  };
}
