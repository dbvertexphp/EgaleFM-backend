import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    features: [{ type: String }],
    // Pricing Array: Different prices for different months
    pricing: [
      {
        months: { type: Number, required: true }, // 1, 3, 6, 12, 24
        price: { type: Number, required: true },
        discountLabel: { type: String }, // Optional: "Save 20%"
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SubscriptionPlan = mongoose.model(
  'SubscriptionPlan',
  subscriptionPlanSchema
);
export default SubscriptionPlan;
