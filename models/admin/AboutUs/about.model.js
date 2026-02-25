import mongoose from "mongoose";

const aboutUsSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export const AboutUs = mongoose.model("AboutUs", aboutUsSchema);