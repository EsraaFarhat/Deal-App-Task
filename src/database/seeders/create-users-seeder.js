import UsersEntity from "../../models/users.model.mjs";
import logger from "../../shared/logger.mjs";
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
      name: "Client User 1",
      phoneNumber: "0987654321",
      password: hashedPassword,
      role: "CLIENT",
    },
    {
      name: "Client User 2",
      phoneNumber: "0987664321",
      password: hashedPassword,
      role: "CLIENT",
    },
    {
      name: "Client User 3",
      phoneNumber: "0987663321",
      password: hashedPassword,
      role: "CLIENT",
    },
    {
      name: "Agent User 1",
      phoneNumber: "1122334455",
      password: hashedPassword,
      role: "AGENT",
    },
    {
      name: "Agent User 2",
      phoneNumber: "1122334456",
      password: hashedPassword,
      role: "AGENT",
    },
    {
      name: "Agent User 3",
      phoneNumber: "1122334477",
      password: hashedPassword,
      role: "AGENT",
    },
  ];

  await UsersEntity.insertMany(users);
  logger.info("Users seeded!");
}

export default createUsers;
