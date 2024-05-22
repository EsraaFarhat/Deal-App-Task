import mongoose from "mongoose";
import { PropertyType } from "../shared/enums.mjs";

const adSchema = new mongoose.Schema(
  {
    propertyType: {
      type: String,
      trim: true,
      enum: Object.values(PropertyType),
      required: true,
    },
    area: {
      type: String,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      trim: true,
      required: true,
    },
    district: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    refreshedAt: {
      type: Date,
      default: new Date(),
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AdsEntity = mongoose.model("Ad", adSchema);

export default AdsEntity;
