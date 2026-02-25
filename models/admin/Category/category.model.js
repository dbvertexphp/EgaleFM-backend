import mongoose from 'mongoose';

const storyCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
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

export default mongoose.model('StoryCategory', storyCategorySchema);
