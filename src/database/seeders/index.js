import mongoose from 'mongoose';
import createUsersSeeder from './create-users-seeder.js';
import createPropertyRequestsSeeder from './create-propertyRequests-seeder.js';
import createAdsSeeder from './create-ads-seeder.js';
import { db } from '../connection.mjs';

async function runSeeders() {
  try {
    await db; // Ensure the database connection is established

    await createUsersSeeder();
    await createPropertyRequestsSeeder();
    await createAdsSeeder();

    console.log('All seeders executed!');
  } catch (error) {
    console.error('Error running seeders:', error);
  } finally {
    mongoose.connection.close();
  }
}

runSeeders();