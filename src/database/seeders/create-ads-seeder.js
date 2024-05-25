import UsersEntity from "../../models/users.model.mjs";
import AdsEntity from "../../models/ads.model.mjs";
import { PropertyType, UserRole } from "../../shared/enums.mjs";
import logger from "../../shared/logger.mjs";

async function createAds() {
  await AdsEntity.deleteMany({}); // Clear the collection

  const agents = await UsersEntity.find({ role: UserRole.AGENT }, "_id", {
    skip: 0,
    limit: 2,
  });

  const ads = [
    {
      propertyType: PropertyType.APARTMENT,
      area: "120",
      city: "New York",
      district: "Manhattan",
      price: 1600,
      description: "Spacious apartment available",
      userId: agents[0]._id,
    },
    {
      propertyType: PropertyType.HOUSE,
      area: "350",
      city: "San Francisco",
      district: "Bay Area",
      price: 3100,
      description: "Beautiful house with garden",
      userId: agents[1]._id,
    },
  ];

  await AdsEntity.insertMany(ads);
  logger.info("Ads seeded!");
}

export default createAds;
