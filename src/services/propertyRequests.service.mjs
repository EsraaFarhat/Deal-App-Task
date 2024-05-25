import Joi from "joi";

import PropertyRequestsEntity from "../models/propertyRequests.model.mjs";
import { PropertyType } from "../shared/enums.mjs";

export default class PropertyRequestsService {
  static async getOneById(id, projection, options) {
    const propertyRequest = await PropertyRequestsEntity.findById(id, projection, options);
    return propertyRequest;
  }

  static async getOne(filters, projection, options) {
    const propertyRequest = await PropertyRequestsEntity.findOne(filters, projection, options);
    return propertyRequest;
  }

  static async getAll(filters, projection, options) {
    const propertyRequests = await PropertyRequestsEntity.find(filters, projection, options);
    return propertyRequests;
  }


  static async createOne(body) {
    let addedPropertyRequest = new PropertyRequestsEntity(body);
    addedPropertyRequest = addedPropertyRequest.save();

    return addedPropertyRequest;
  }

  static async updateOne(filters, body) {
    const updatedPropertyRequest = await PropertyRequestsEntity.findOneAndUpdate(filters, body, {
      new: true,
    });
    return updatedPropertyRequest;
  }

  static async aggregate(pipeline) {
    const propertyRequests = await PropertyRequestsEntity.aggregate(pipeline);
    return propertyRequests;
  }

  static async count(filters) {
    const count = await PropertyRequestsEntity.countDocuments(filters);
    return count;
  }

  static validateCreatePropertyRequest= (propertyRequest) => {
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
