import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  razorpay_payment_id: { type: String, required: true },
  razorpay_order_id: { type: String, required: true },
  amount: { type: Number, required: true },
  months: { type: Number, required: true },
  status: { type: String, enum: ['success', 'failed'], default: 'success' }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);