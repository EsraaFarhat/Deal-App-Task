import Joi from "joi";

import PropertyRequestsEntity from "../models/propertyRequests.model.mjs";
import { PropertyType } from "../shared/enums.mjs";

export default class PropertyRequestsService {
  static async getPropertyRequestById(id, projection, options) {
    const propertyRequest = await PropertyRequestsEntity.findById(id, projection, options);
    return propertyRequest;
  }

  static async getPropertyRequest(filters, projection, options) {
    const propertyRequest = await PropertyRequestsEntity.findOne(filters, projection, options);
    return propertyRequest;
  }

  static async addPropertyRequest(body) {
    let addedPropertyRequest = new PropertyRequestsEntity(body);
    addedPropertyRequest = addedPropertyRequest.save();

    return addedPropertyRequest;
  }

  static async updatePropertyRequest(filters, body) {
    const updatedPropertyRequest = await PropertyRequestsEntity.findOneAndUpdate(filters, body, {
      new: true,
    });
    return updatedPropertyRequest;
  }

  static createPropertyRequestSchema = (propertyRequest) => {
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

  static updatePropertyRequestSchema = (propertyRequest) => {
    const schema = Joi.object({
      propertyType: Joi.string()
        .trim()
        .valid(...Object.values(PropertyType)),
      area: Joi.string().trim(),
      city: Joi.string().trim(),
      district: Joi.string().trim(),
      price: Joi.number().min(0),
      description: Joi.string().trim(),
    });

    return schema.validate(propertyRequest);
  };
}
