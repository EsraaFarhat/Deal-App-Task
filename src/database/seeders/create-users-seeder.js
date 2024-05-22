import UsersEntity from "../../models/users.model.mjs";

async function createUsers() {
  await UsersEntity.deleteMany({}); // Clear the collection

  const users = [
    {
      name: "Admin User",
      phoneNumber: "1234567890",
      password: "password123",
      role: "ADMIN",
    },
    {
      name: "Client User",
      phoneNumber: "0987654321",
      password: "password123",
      role: "CLIENT",
    },
    {
      name: "Agent User",
      phoneNumber: "1122334455",
      password: "password123",
      role: "AGENT",
    },
  ];

  await UsersEntity.insertMany(users);
  console.log("Users seeded!");
}

export default createUsers;
