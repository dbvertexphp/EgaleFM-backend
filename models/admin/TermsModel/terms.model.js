import mongoose from "mongoose";
import { protect } from '../../../middleware/authMiddleware.js';
import { authorize } from '../../../middleware/Authorization.middleware.js';
const termsSchema = new mongoose.Schema({
  content: { type: String, required: true }
}, { timestamps: true });

export const TermsConditions = mongoose.model("TermsConditions", termsSchema);
