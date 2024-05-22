import UsersEntity from "../../models/users.model.mjs";
import { hashString } from "../../utils/helpers.mjs";

async function createUsers() {
  await UsersEntity.deleteMany({}); // Clear the collection

  const hashedPassword = await hashString("Aa12345@");

  const users = [
    {
      name: "Admin User",
      phoneNumber: "1234567890",
      password: hashedPassword,
      role: "ADMIN",
    },
    {
      name: "Client User",
      phoneNumber: "0987654321",
      password: hashedPassword,
      role: "CLIENT",
    },
    {
      name: "Agent User",
      phoneNumber: "1122334455",
      password: hashedPassword,
      role: "AGENT",
    },
  ];

  await UsersEntity.insertMany(users);
  console.log("Users seeded!");
}

export default createUsers;
