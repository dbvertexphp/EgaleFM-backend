import UserStory from '../../models/user/UserStory.model.js';
import StoryCategory from '../../models/admin/Category/category.model.js';

export const createUserStory = async (req, res, next) => {
  try {
    const { category, title, description } = req.body;

    if (!category || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const categoryExists = await StoryCategory.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Text file is required',
      });
    }

    const story = await UserStory.create({
      user: req.user._id, // auth middleware se user id
      category,
      title,
      description,
      textFile: req.file.path.replace(/\\/g, '/'),
    });

    res.status(201).json({
      success: true,
      message: 'Story submitted successfully. Waiting for admin approval.',
      data: story,
    });
  } catch (error) {
    next(error);
  }
};
