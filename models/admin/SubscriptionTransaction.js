import mongoose from 'mongoose';

const subscriptionTransactionSchema = new mongoose.Schema(
  {
    transaction_id: {
      type: String,
      required: true,
      unique: true,
      default: () => `#${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // User model se link
      required: true,
    },
    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan', // Plan model se link
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: 'online',
    },
    gatewayTransactionId: {
      type: String, // Payment gateway (Razorpay/Stripe) ki ID store karne ke liye
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    durationInDays: {
      type: Number,
    },
  },
  { timestamps: true }
);

const SubscriptionTransaction = mongoose.model('SubscriptionTransaction', subscriptionTransactionSchema);
export default SubscriptionTransaction;