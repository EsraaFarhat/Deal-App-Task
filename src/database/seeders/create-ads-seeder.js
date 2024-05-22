import UsersEntity from "../../models/users.model.mjs";
import AdsEntity from "../../models/ads.model.mjs";
import { PropertyType, UserRole } from "../../shared/enums.mjs";

async function createAds() {
  await AdsEntity.deleteMany({}); // Clear the collection

  const agent = await UsersEntity.findOne({ role: UserRole.AGENT }, "_id");

  const ads = [
    {
      propertyType: PropertyType.APARTMENT,
      area: "130",
      city: "New York",
      district: "Manhattan",
      price: 1600,
      description: "Spacious apartment available",
      userId: agent._id,
    },
    {
      propertyType: PropertyType.HOUSE,
      area: "350",
      city: "San Francisco",
      district: "Bay Area",
      price: 3100,
      description: "Beautiful house with garden",
      userId: agent._id,
    },
  ];

  await AdsEntity.insertMany(ads);
  console.log("Ads seeded!");
}

export default createAds;
