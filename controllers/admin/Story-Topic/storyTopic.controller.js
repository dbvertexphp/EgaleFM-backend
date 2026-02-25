// import mongoose from 'mongoose';
import StoryTopic from '../../../models/admin/Story-Topic/storyTopic.model.js';
import StoryChapter from '../../../models/admin/Story-chapter/storyChapter.model.js';
import fs from 'fs';

// CREATE
export const createStoryTopic = async (req, res, next) => {
  try {
    const { title, description, storyChapter } = req.body;

    if (!title || !storyChapter) {
      return res.status(400).json({
        success: false,
        message: 'Title and Chapter required',
      });
    }

    const chapterExists = await StoryChapter.findById(storyChapter);
    if (!chapterExists) {
      return res.status(404).json({
        success: false,
        message: 'Story Chapter not found',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Audio file required',
      });
    }

    const topic = await StoryTopic.create({
      title,
      description,
      storyChapter,
      audioUrl: req.file.path.replace(/\\/g, '/'),
      createdBy: req.admin._id,
      updatedBy: req.admin._id,
    });

    res.status(201).json({
      success: true,
      message: 'Story Topic created successfully',
      data: topic,
    });
  } catch (error) {
    next(error);
  }
};

// GET BY CHAPTER
export const getTopicsByChapter = async (req, res, next) => {
  try {
    const topics = await StoryTopic.find({
      storyChapter: req.params.chapterId,
    })
      .populate('storyChapter', 'title')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      count: topics.length,
      data: topics,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL TOPICS (Admin Panel)
export const getAllTopics = async (req, res, next) => {
  try {
    const topics = await StoryTopic.find()
      .populate('storyChapter', 'title')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: topics.length,
      data: topics,
    });
  } catch (error) {
    next(error);
  }
};

// GET BY ID
export const getStoryTopicById = async (req, res, next) => {
  try {
    const topic = await StoryTopic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Story Topic not found',
      });
    }

    res.json({ success: true, data: topic });
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateStoryTopic = async (req, res, next) => {
  try {
    const topic = await StoryTopic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Story Topic not found',
      });
    }

    const { title, description, isPublished } = req.body;

    if (title) topic.title = title;
    if (description !== undefined) topic.description = description;
    if (typeof isPublished === 'boolean') topic.isPublished = isPublished;

    if (req.file) {
      topic.audioUrl = req.file.path.replace(/\\/g, '/');
    }

    topic.updatedBy = req.admin._id;

    await topic.save();

    res.json({
      success: true,
      message: 'Story Topic updated successfully',
      data: topic,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deleteStoryTopic = async (req, res, next) => {
  try {
    const topic = await StoryTopic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Story Topic not found',
      });
    }

    // delete audio file
    if (topic.audioUrl && fs.existsSync(topic.audioUrl)) {
      fs.unlinkSync(topic.audioUrl);
    }

    await topic.deleteOne();

    res.json({
      success: true,
      message: 'Story Topic deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

