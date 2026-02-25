import mongoose from 'mongoose';

const videoProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  watchTime: { type: Number, default: 0 }, // Seconds mein student ne kitna dekha
  totalDuration: { type: Number, default: 0 }, // Video ki total length kitni hai
  percentage: { type: Number, default: 0 }, // (watchTime / totalDuration) * 100
  status: { type: String, enum: ['unattended', 'watching', 'completed'], default: 'unattended' }
}, { timestamps: true });

// Ek user ka ek video ke liye ek hi progress record hona chahiye
videoProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true });

export default mongoose.model('VideoProgress', videoProgressSchema);