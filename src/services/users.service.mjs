import Joi from "joi";
import UsersEntity from "../models/users.model.mjs";

export default class UsersService {
  static async getOneById(id, projection, options) {
    const user = await UsersEntity.findById(id, projection, options);
    return user;
  }

  static async getOne(filters, projection, options) {
    const user = await UsersEntity.findOne(filters, projection, options);
    return user;
  }

  static async createOne(body) {
    let addedUser = new UsersEntity(body);
    addedUser = addedUser.save();

    return addedUser;
  }

  static async updateOne(filters, body) {
    const updatedUser = await UsersEntity.findOneAndUpdate(filters, body, {
      new: true,
    });
    return updatedUser;
  }

  static async getAdsStatisticsForUser(id, projection, options) {
    const updatedUser = await UsersEntity.findOneAndUpdate(filters, body, {
      new: true,
    });
    return updatedUser;
  }

  static async getPropertyRequestsStatisticsForUser(id, projection, options) {
    const updatedUser = await UsersEntity.findOneAndUpdate(filters, body, {
      new: true,
    });
    return updatedUser;
  }

  static async aggregate(pipeline) {
    const users = await UsersEntity.aggregate(pipeline);
    return users;
  }

  static async count(filters) {
    const count = await UsersEntity.countDocuments(filters);
    return count;
  }

  static validateUserLogin = (body) => {
    const schema = Joi.object({
      phoneNumber: Joi.string().min(1).max(100).required(),
      password: Joi.string()
        .min(6)
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{6,}$/
        )
        .messages({
          "string.base": "Incorrect username or password",
          "string.empty": "Incorrect username or password",
          "string.min": "Incorrect username or password",
          "string.pattern.base": "Incorrect username or password",
          "any.required": "Incorrect username or password",
        })
        .required(),
    });
    return schema.validate(body);
  };
}
