// import mongoose from 'mongoose';

// const videoSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   videoUrl: { type: String, required: true }, // YouTube/Vimeo link ya path
//   courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
//   subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
//   subSubjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubSubject', required: true },
//   chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
//   order: { type: Number, default: 0 },
//   status: { type: String, enum: ['active', 'inactive'], default: 'active' },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
//   updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
// }, { timestamps: true });

// export default mongoose.model('Video', videoSchema);
//working

import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String }, // ✅ New Field for Thumbnail
    notesUrl: { type: String }, // ✅ New Field for PDF/Notes
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    subSubjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubSubject',
      required: true,
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
    },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);
// Topic wise video ordering ke liye index
videoSchema.index({ topicId: 1, order: 1 });

export default mongoose.model('Video', videoSchema);
