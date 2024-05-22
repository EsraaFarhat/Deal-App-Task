import Joi from "joi";
import UsersEntity from "../models/users.model.mjs";

export default class UsersService {
  static async getUserById(id, projection, options) {
    const user = await UsersEntity.findById(id, projection, options);
    return user;
  }

  static async getUser(filters, projection, options) {
    const user = await UsersEntity.findOne(filters, projection, options);
    return user;
  }

  static async addUser(body) {
    let addedUser = new UsersEntity(body);
    addedUser = addedUser.save();

    return addedUser;
  }

  static async updateUser(filters, body) {
    const updatedUser = await UsersEntity.findOneAndUpdate(filters, body, {
      new: true,
    });
    return updatedUser;
  }

  static userLoginSchema = (body) => {
    const schema = Joi.object({
      email: Joi.string().min(6).max(50).email().required(),
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
