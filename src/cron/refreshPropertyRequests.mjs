import cron from 'node-cron';

import PropertyRequestsEntity from '../models/propertyRequests.model.mjs';


// A cron job to refresh property requests every 3 days
cron.schedule('0 0 */3 * *', async () => {
  await PropertyRequestsEntity.updateMany({}, { refreshedAt: Date.now() });
}, {
  scheduled: true,
  timezone: 'UTC'
});
