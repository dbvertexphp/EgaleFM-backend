import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true }, // e.g., 20 (%) or 500 (flat)
  maxDiscount: { type: Number, default: 0 }, // Sirf percentage discount ke liye (Upto ₹200)
  minPurchase: { type: Number, default: 0 }, // Kam se kam kitne ka plan hona chahiye
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, default: 100 }, // Total kitne log use kar sakte hain
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  // Specific plans ke liye restriction (Optional)
  applicableMonths: [{ type: Number }] // e.g., [6, 12] (Sirf 6 ya 12 mahine wale plan par chalega)
}, { timestamps: true });

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);
export default PromoCode;