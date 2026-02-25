import StoryChapter from '../../../models/admin/Story-chapter/storyChapter.model.js';
import StoryCategory from '../../../models/admin/Category/category.model.js';

import mongoose from 'mongoose';
/**
 * Create Story Chapter
 */
export const createStoryChapter = async (req, res, next) => {
  try {
    const { title, description, chapterNumber, storyCategory } = req.body;

    if (!title || !chapterNumber || !storyCategory) {
      return res.status(400).json({
        success: false,
        message: 'Title, chapter number and category are required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Chapter image is required',
      });
    }

    const categoryExists = await StoryCategory.findById(storyCategory);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Story Category not found',
      });
    }

    // Prevent duplicate chapter number inside same category
    const duplicate = await StoryChapter.findOne({
      storyCategory,
      chapterNumber,
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: 'Chapter number already exists in this category',
      });
    }

    const chapter = await StoryChapter.create({
      title,
      description,
      chapterNumber,
      storyCategory,
      image: req.file.path,
      createdBy: req.admin._id,
      updatedBy: req.admin._id,
    });

    res.status(201).json({
      success: true,
      message: 'Story Chapter created successfully',
      data: chapter,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Chapters By Category
 */
export const getChaptersByCategory = async (req, res, next) => {
  try {
    const chapters = await StoryChapter.find({
      storyCategory: req.params.categoryId,
    })
      .populate('storyCategory', 'name')
      .sort({ chapterNumber: 1 });

    res.status(200).json({
      success: true,
      count: chapters.length,
      data: chapters,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllChapters = async (req, res) => {
  const chapters = await StoryChapter.find()
    .populate('storyCategory', 'name')
    .sort({ chapterNumber: 1 });

  res.json({
    success: true,
    data: chapters,
  });
};

/**
 * Get Chapter By ID
 */
export const getStoryChapterById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid chapter ID',
      });
    }

    const chapter = await StoryChapter.findById(id)
      .populate('storyCategory', 'name')
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name');

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Story Chapter not found',
      });
    }

    res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Story Chapter
 */
export const updateStoryChapter = async (req, res, next) => {
  try {
    const chapter = await StoryChapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Story Chapter not found',
      });
    }

    const { title, description, chapterNumber, isPublished } = req.body;

    if (title) chapter.title = title;
    if (description !== undefined) chapter.description = description;
    if (chapterNumber) chapter.chapterNumber = chapterNumber;
    if (typeof isPublished === 'boolean') chapter.isPublished = isPublished;

    // Update image if new uploaded
    if (req.file) {
      chapter.image = req.file.path;
    }

    chapter.updatedBy = req.admin._id;

    await chapter.save();

    res.status(200).json({
      success: true,
      message: 'Story Chapter updated successfully',
      data: chapter,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Story Chapter
 */
export const deleteStoryChapter = async (req, res, next) => {
  try {
    const chapter = await StoryChapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Story Chapter not found',
      });
    }

    await StoryChapter.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Story Chapter deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
