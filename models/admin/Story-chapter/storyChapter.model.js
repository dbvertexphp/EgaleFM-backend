import mongoose from 'mongoose';

const storyChapterSchema = new mongoose.Schema(
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

    chapterNumber: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true, // ✅ now required
    },

    storyCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StoryCategory',
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

export default mongoose.model('StoryChapter', storyChapterSchema);
