import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true, 
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true, 
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const PageModel= mongoose.model('Page', pageSchema);
export default PageModel;
