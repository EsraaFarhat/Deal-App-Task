import mongoose from 'mongoose';
import createUsersSeeder from './create-users-seeder.js';
import createPropertyRequestsSeeder from './create-propertyRequests-seeder.js';
import createAdsSeeder from './create-ads-seeder.js';
import { db } from '../connection.mjs';
import logger from '../../shared/logger.mjs';

/**
 * Executes all seeders to populate the database with initial data.
 *
 * @return {Promise<void>} A promise that resolves when all seeders have been executed successfully.
 * @throws {Error} If there is an error running the seeders.
 */
async function runSeeders() {
  try {
    await db; // Ensure the database connection is established

    await createUsersSeeder();
    await createPropertyRequestsSeeder();
    await createAdsSeeder();

    logger.info('All seeders executed!');
  } catch (error) {
    logger.error('Error running seeders:', error);
  } finally {
    mongoose.connection.close();
  }
}

runSeeders();