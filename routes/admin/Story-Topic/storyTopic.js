import express from 'express';
import { protect } from '../../../middleware/authMiddleware.js';
import { authorize } from '../../../middleware/Authorization.middleware.js';
import upload from '../../../middleware/upload.js';

import {
  createStoryTopic,
  getTopicsByChapter,
  getStoryTopicById,
  updateStoryTopic,
  deleteStoryTopic,
  getAllTopics, 
} from '../../../controllers/admin/Story-Topic/storyTopic.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

// ✅ CREATE TOPIC
router.post('/story-topics', upload.single('audio'), createStoryTopic);

// ✅ GET ALL (for admin table)
router.get('/story-topics', getAllTopics);

// ✅ GET BY CHAPTER
router.get('/story-topics/chapter/:chapterId', getTopicsByChapter);

// ✅ GET SINGLE
router.get('/story-topics/:id', getStoryTopicById);

// ✅ UPDATE
router.patch('/story-topics/:id', upload.single('audio'), updateStoryTopic);

// ✅ DELETE
router.delete('/story-topics/:id', deleteStoryTopic);

export default router;
