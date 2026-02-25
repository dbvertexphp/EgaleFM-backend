import mongoose from 'mongoose';

const storyTopicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    audioUrl: {
      type: String,
      required: true,
    },

    duration: {
      type: Number, // seconds (optional)
    },

    storyChapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StoryChapter',
      required: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

export default mongoose.model('StoryTopic', storyTopicSchema);
