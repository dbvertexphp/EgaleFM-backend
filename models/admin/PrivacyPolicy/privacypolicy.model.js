import mongoose from "mongoose";

const privacySchema = new mongoose.Schema({
  content: { type: String, required: true }
}, { timestamps: true });

export const PrivacyPolicy = mongoose.model("PrivacyPolicy", privacySchema);