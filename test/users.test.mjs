import request from "supertest";
import mongoose from 'mongoose';
import { expect } from "chai";
import app from "../src/app.mjs"; // Import your Express app
import UsersEntity from "../src/models/users.model.mjs"; // Import your User model
import PropertyRequestsEntity from "../src/models/propertyRequests.model.mjs"; // Import your Property Request model
import AdsEntity from "../src/models/ads.model.mjs"; // Import your Ads model
import { generateToken } from "../src/utils/helpers.mjs"; // Import your token generation utility
import MESSAGES from "../src/shared/messages.mjs";
import { HTTP_CODES } from "../src/shared/status-codes.mjs";

describe("Admin Statistics Endpoint", () => {
  let adminToken, agentToken, clientToken;

  before(async () => {
    // Setup test data
    const admin = await UsersEntity.create({
      name: "Admin User",
      phoneNumber: "1234567890",
      role: "ADMIN",
      password: "password123",
    });

    const agent = await UsersEntity.create({
      name: "Agent User",
      phoneNumber: "1122334455",
      role: "AGENT",
      password: "password123",
    });

    const client = await UsersEntity.create({
      name: "Client User",
      phoneNumber: "0987654321",
      role: "CLIENT",
      password: "password123",
    });

    await AdsEntity.create([
      {
        userId: agent._id,
        propertyType: "APARTMENT",
        area: "100",
        city: "City",
        district: "District",
        price: 1500,
        description: "Description 1",
      },
      {
        userId: agent._id,
        propertyType: "HOUSE",
        area: "200",
        city: "City",
        district: "District",
        price: 3200,
        description: "Description 2",
      },
    ]);

    await PropertyRequestsEntity.create([
      {
        userId: client._id,
        propertyType: "APARTMENT",
        area: "50",
        city: "City",
        district: "District",
        price: 1000,
        description: "Description 3",
      },
      {
        userId: client._id,
        propertyType: "APARTMENT",
        area: "50",
        city: "City",
        district: "District",
        price: 1500,
        description: "Description 4",
      },
      {
        userId: client._id,
        propertyType: "APARTMENT",
        area: "50",
        city: "City",
        district: "District",
        price: 2000,
        description: "Description 5",
      },
      {
        userId: client._id,
        propertyType: "APARTMENT",
        area: "50",
        city: "City",
        district: "District",
        price: 3950,
        description: "Description 6",
      },
    ]);

    // Generate admin token
    adminToken = generateToken({ userId: admin._id });
    agentToken = generateToken({ userId: agent._id });
    clientToken = generateToken({ userId: client._id });
  });

  after(async () => {
    // Cleanup test data
    await UsersEntity.deleteMany({});
    await AdsEntity.deleteMany({});
    await PropertyRequestsEntity.deleteMany({});
   
    // Close the database connection
    await mongoose.connection.close();
  });

  it("should return user statistics for admin", async () => {
    console.log(adminToken);
    const res = await request(app)
      .get("/api/users/statistics")
      .set("Authorization", `Bearer ${adminToken}`)
      .query({ pageNumber: 1, limit: 2 });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("data");
    expect(res.body).to.have.property("page").that.equals(1);
    expect(res.body).to.have.property("limit").that.equals(2);
    expect(res.body).to.have.property("total");
    expect(res.body).to.have.property("hasNextPage");
    expect(res.body).to.have.property("hasPreviousPage");

    const rows = res.body.data.rows;
    expect(rows).to.be.an("array").that.has.lengthOf(2);

    rows.forEach((user) => {
      expect(user).to.have.property("_id");
      expect(user).to.have.property("name");
      expect(user).to.have.property("role");
      expect(user).to.have.property("phoneNumber");
      expect(user).to.have.property("adsCount");
      expect(user).to.have.property("totalAdsAmount");
      expect(user).to.have.property("requestsCount");
      expect(user).to.have.property("totalRequestsAmount");
    });
  });

  it("should require authentication", async () => {
    const res = await request(app).get("/api/users/statistics");

    expect(res.status).to.equal(HTTP_CODES.CLIENT.UNAUTHORIZED);
    expect(res.body)
      .to.have.property("error")
      .that.equals(MESSAGES.AUTHENTICATION_FAILED);
  });

  it('should not allow a client to access the statistics', async () => {
    const res = await request(app)
      .get('/api/users/statistics')
      .set('Authorization', `Bearer ${clientToken}`)
      .query({ pageNumber: 1, limit: 2 });

    expect(res.status).to.equal(HTTP_CODES.CLIENT.FORBIDDEN);
    expect(res.body).to.have.property('error').that.equals(MESSAGES.FORBIDDEN_ERROR);
  });

  it('should not allow an agent to access the statistics', async () => {
    const res = await request(app)
      .get('/api/users/statistics')
      .set('Authorization', `Bearer ${agentToken}`)
      .query({ pageNumber: 1, limit: 2 });

      expect(res.status).to.equal(HTTP_CODES.CLIENT.FORBIDDEN);
      expect(res.body).to.have.property('error').that.equals(MESSAGES.FORBIDDEN_ERROR);
  });

  it('should return an error for an invalid token', async () => {
    const invalidToken = 'someInvalidToken';
    const res = await request(app)
      .get('/api/users/statistics')
      .set('Authorization', `Bearer ${invalidToken}`)
      .query({ pageNumber: 1, limit: 2 });

    expect(res.status).to.equal(HTTP_CODES.CLIENT.UNAUTHORIZED);
    expect(res.body).to.have.property('error').that.equals(MESSAGES.INVALID_TOKEN);
  });
});
