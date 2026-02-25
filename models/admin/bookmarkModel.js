// import mongoose from "mongoose";

// const bookmarkSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

//     type: {
//       type: String,
//       enum: ["mcq", "chapter", "topic", "sub-subject"],
//       required: true
//     },

//     category: {
//       type: String,
//       enum: ["important", "veryimportant", "mostimportant"],
//       required: true
//     },

//     mcqId: { type: mongoose.Schema.Types.ObjectId, ref: "MCQ", default: null },
//     chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", default: null },
//     topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", default: null }, // Naya Field
//     subSubjectId: { type: mongoose.Schema.Types.ObjectId, ref: "SubSubject", default: null },
//   },
//   { timestamps: true }
// );

// bookmarkSchema.index(
//   { userId: 1, type: 1, category: 1, mcqId: 1, topicId: 1, chapterId: 1, subSubjectId: 1 },
//   { unique: true }
// );

// export default mongoose.model("Bookmark", bookmarkSchema);

import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ['mcq', 'chapter', 'topic', 'sub-subject'],
      required: true,
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    category: {
      type: String,
      enum: ['important', 'veryimportant', 'mostimportant'],
      required: true,
    },
  },
  { timestamps: true }
);

// 🔥 CLEAN UNIQUE INDEX
bookmarkSchema.index({ userId: 1, type: 1, itemId: 1 }, { unique: true });

export default mongoose.model('Bookmark', bookmarkSchema);
