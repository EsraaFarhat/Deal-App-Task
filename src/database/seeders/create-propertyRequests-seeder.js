import UsersEntity from "../../models/users.model.mjs";
import PropertyRequestsEntity from "../../models/propertyRequests.model.mjs";
import { PropertyType, UserRole } from "../../shared/enums.mjs";

async function createPropertyRequests() {
  await PropertyRequestsEntity.deleteMany({}); // Clear the collection

  const clients = await UsersEntity.find({ role: UserRole.CLIENT }, "_id", {
    skip: 0,
    limit: 2,
  });

  const propertyRequests = [
    {
      propertyType: PropertyType.APARTMENT,
      area: "120",
      city: "New York",
      district: "Manhattan",
      price: 1500,
      description: "Looking for a 2 bedroom apartment",
      userId: clients[0]._id,
    },
    {
      propertyType: PropertyType.VILLA,
      area: "350",
      city: "San Francisco",
      district: "Bay Area",
      price: 3200,
      description: "Need a house with a garden",
      userId: clients[0]._id,
    },
    {
      propertyType: PropertyType.HOUSE,
      area: "300",
      city: "San Francisco",
      district: "Bay Area",
      price: 3000,
      description: "Need a house with a garden",
      userId: clients[0]._id,
    },
    {
      propertyType: PropertyType.HOUSE,
      area: "350",
      city: "San Francisco",
      district: "Bay Area",
      price: 2990,
      description: "Need a house with a garden",
      userId: clients[1]._id,
    },
    {
      propertyType: PropertyType.LAND,
      area: "500",
      city: "San Francisco",
      district: "Bay Area",
      price: 1000,
      description: "Need a house with a garden",
      userId: clients[1]._id,
    },
  ];

  await PropertyRequestsEntity.insertMany(propertyRequests);
  console.log("Property Requests seeded!");
}

export default createPropertyRequests;
