import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserRole, UserStatus } from "../shared/enums.mjs";
import { comparePassword, hashString } from "../utils/helpers.mjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 100,
      required: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 100,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      trim: true,
      enum: Object.values(UserRole),
      required: true,
    },
    status: {
      type: String,
      trim: true,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await hashString(this.password);

  next();
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return await comparePassword(plainPassword, this.password);
};

const UsersEntity = mongoose.model("User", userSchema);

export default UsersEntity;
