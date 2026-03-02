import mongoose from 'mongoose';

/* ===========================
   CHAPTER SUB SCHEMA
=========================== */
const chapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String, // chapter image path
    },
  },
  { timestamps: true }
);

/* ===========================
   MAIN STORY SCHEMA
=========================== */
const userStorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // ⚡ faster queries
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StoryCategory',
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ NEW: Main Story Image
    coverImage: {
      type: String,
    },

    textFile: {
      type: String,
      required: true,
    },

    // ✅ NEW: Multiple Chapters
    chapters: [chapterSchema],

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },

    adminRemark: {
      type: String,
      default: '',
    },

    /* ===========================
       AUDIO SECTION
    =========================== */

    audioTitle: {
      type: String,
      trim: true,
    },

    audioDescription: {
      type: String,
      trim: true,
    },

    audioFile: {
      type: String,
    },

    isAudioPublished: {
      type: Boolean,
      default: false,
    },

    audioPublishedAt: {
      type: Date,
    },

    /* ===========================
       LIKES
    =========================== */

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    /* ===========================
       COMMENTS
    =========================== */

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },

        text: {
          type: String,
          required: true,
          trim: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

/* ===========================
   VIRTUALS (Professional Touch)
=========================== */

// total likes count
userStorySchema.virtual('totalLikes').get(function () {
  return this.likes.length;
});

// enable virtuals in response
userStorySchema.set('toJSON', { virtuals: true });
userStorySchema.set('toObject', { virtuals: true });

export default mongoose.model('UserStory', userStorySchema);
