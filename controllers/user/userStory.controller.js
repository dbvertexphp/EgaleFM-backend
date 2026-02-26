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
        message: 'Text file required',
      });
    }

    const story = await UserStory.create({
      user: req.user._id, // ✅ correct
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

// GET MY STORIES (USER)
export const getMyStories = async (req, res, next) => {
  try {
    const stories = await UserStory.find({ user: req.user._id })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE STORY BY ID (USER)
export const getMyStoryById = async (req, res, next) => {
  try {
    const story = await UserStory.findOne({
      _id: req.params.id,
      user: req.user._id, // 🔐 ensures user owns the story
    })
      .populate('category', 'name')
      .populate('user', 'name email');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

// LIKE / UNLIKE STORY
export const toggleLikeStory = async (req, res, next) => {
  try {
    const story = await UserStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    const userId = req.user._id;

    const alreadyLiked = story.likes.includes(userId);

    if (alreadyLiked) {
      // ❌ Unlike
      story.likes = story.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // ❤️ Like
      story.likes.push(userId);
    }

    await story.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      totalLikes: story.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

// ADD COMMENT
export const addCommentToStory = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Comment text required',
      });
    }

    const story = await UserStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    story.comments.push({
      user: req.user._id,
      text,
    });

    await story.save();

    res.status(201).json({
      success: true,
      message: 'Comment added',
      data: story.comments,
    });
  } catch (error) {
    next(error);
  }
};

export const getStoryComments = async (req, res, next) => {
  try {
    const story = await UserStory.findById(req.params.id).populate(
      'comments.user',
      'name email image'
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    res.status(200).json({
      success: true,
      count: story.comments.length,
      data: story.comments,
    });
  } catch (error) {
    next(error);
  }
};
