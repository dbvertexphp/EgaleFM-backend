import cron from 'node-cron';
import User from '../models/user/userModel.js';

export const startSubscriptionCron = () => {
  // Har 1 ghante me check karega
  cron.schedule('0 * * * *', async () => {
    console.log('Running subscription cron...');

    try {
      const now = new Date();

      // Trial expired users
      await User.updateMany(
        {
          trialExpiry: { $lt: now },
          isSubscribed: false,
        },
        {
          $set: { trialExpired: true },
        }
      );

      // Expired subscription users
      await User.updateMany(
        {
          subscriptionExpiry: { $lt: now },
        },
        {
          $set: { isSubscribed: false },
        }
      );
    } catch (error) {
      console.log(error);
    }
  });
};
