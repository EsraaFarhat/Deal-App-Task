import UsersEntity from "../../models/users.model.mjs";
import PropertyRequestsEntity from "../../models/propertyRequests.model.mjs";
import { PropertyType, UserRole } from "../../shared/enums.mjs";

async function createPropertyRequests() {
  await PropertyRequestsEntity.deleteMany({}); // Clear the collection

  const client = await UsersEntity.findOne({ role: UserRole.CLIENT }, "_id");

  const propertyRequests = [
    {
      propertyType: PropertyType.APARTMENT,
      area: "120",
      city: "New York",
      district: "Manhattan",
      price: 1500,
      description: "Looking for a 2 bedroom apartment",
      userId: client._id,
    },
    {
      propertyType: PropertyType.HOUSE,
      area: "300",
      city: "San Francisco",
      district: "Bay Area",
      price: 3000,
      description: "Need a house with a garden",
      userId: client._id,
    },
  ];

  await PropertyRequestsEntity.insertMany(propertyRequests);
  console.log("Property Requests seeded!");
}

export default createPropertyRequests;
