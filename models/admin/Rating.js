

// import mongoose from 'mongoose';

// const ratingSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   // 👇 Ye field add karna compulsory hai
//   videoId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Video',
//     required: true
//   },
//   rating: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 5
//   },
//   review: {
//     type: String,
//     trim: true
//   }
// }, { timestamps: true });

// // Ek user ek video ko ek hi baar rate kar sake (Optional but good)
// ratingSchema.index({ userId: 1, videoId: 1 }, { unique: true });

// export default mongoose.model('Rating', ratingSchema);


import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    targetType: {
      type: String,
      enum: ['course', 'subject','sub-subject','topic','chapter','video', 'test'],
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    review: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// 🚫 prevent duplicate rating
ratingSchema.index(
  { userId: 1, targetType: 1, targetId: 1 },
  { unique: true }
);

export default mongoose.model('Rating', ratingSchema);
