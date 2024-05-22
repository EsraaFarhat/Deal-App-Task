import mongoose from "mongoose";
import { PropertyType } from "../shared/enums.mjs";

const propertyRequestSchema = new mongoose.Schema(
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
      type: String,
      required: true,
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

const PropertyRequestsEntity = mongoose.model(
  "PropertyRequest",
  propertyRequestSchema
);

export default PropertyRequestsEntity;
