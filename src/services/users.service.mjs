import Joi from "joi";

import UsersEntity from "../models/users.model.mjs";

export default class UsersService {
  /**
   * Retrieves a user from the database by their ID.
   *
   * @param {string} id - The ID of the user to retrieve.
   * @param {string} projection - The fields to include or exclude from the retrieved user.
   * @param {object} options - Additional options for the query.
   * @return {Promise<object>} A promise that resolves to the retrieved user object.
   */
  static async getOneById(id, projection, options) {
    const user = await UsersEntity.findById(id, projection, options);
    return user;
  }

  /**
   * Retrieves a user from the database based on the provided filters, projection, and options.
   *
   * @param {Object} filters - The filters to apply when querying the database.
   * @param {string} projection - The fields to include or exclude from the retrieved user.
   * @param {Object} options - Additional options for the query.
   * @return {Promise<Object>} A promise that resolves to the retrieved user object.
   */
  static async getOne(filters, projection, options) {
    const user = await UsersEntity.findOne(filters, projection, options);
    return user;
  }

  /**
   * Creates a new user in the database.
   *
   * @param {Object} body - The user data to be saved.
   * @return {Promise<Object>} A promise that resolves to the saved user object.
   */
  static async createOne(body) {
    let addedUser = new UsersEntity(body);
    addedUser = addedUser.save();

    return addedUser;
  }

  /**
   * Updates a user in the database based on the provided filters and body.
   *
   * @param {Object} filters - The filters to apply when querying the database.
   * @param {Object} body - The updated user data.
   * @return {Promise<Object>} A promise that resolves to the updated user object.
   */
  static async updateOne(filters, body) {
    const updatedUser = await UsersEntity.findOneAndUpdate(filters, body, {
      new: true,
    });
    return updatedUser;
  }

  /**
   * Aggregates the users based on the provided pipeline.
   *
   * @param {Array<Object>} pipeline - The pipeline to apply to the users collection.
   * @return {Promise<Array<Object>>} A promise that resolves to the aggregated users.
   */
  static async aggregate(pipeline) {
    const users = await UsersEntity.aggregate(pipeline);
    return users;
  }

  /**
   * Asynchronously counts the number of documents in the UsersEntity collection that match the given filters.
   *
   * @param {Object} filters - The filters to apply to the count operation.
   * @return {Promise<number>} A promise that resolves to the count of documents that match the filters.
   */
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
