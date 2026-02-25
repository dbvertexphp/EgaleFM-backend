import mongoose from 'mongoose';

const userStorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StoryCategory',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    textFile: {
      type: String, // uploaded file path
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    adminRemark: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('UserStory', userStorySchema);
