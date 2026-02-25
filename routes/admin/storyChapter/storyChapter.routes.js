import express from 'express';
import { protect } from '../../../middleware/authMiddleware.js';
import { authorize } from '../../../middleware/Authorization.middleware.js';
import {
  createStoryChapter,
  getChaptersByCategory,
  getStoryChapterById,
  updateStoryChapter,
  getAllChapters,
  deleteStoryChapter,
} from '../../../controllers/admin/StoryChapter/storyChapter.controller.js';
import upload from '../../../middleware/upload.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.post('/story-chapters', upload.single('image'), createStoryChapter);

router.get('/story-chapters/category/:categoryId', getChaptersByCategory);

router.get('/story-chapters/:id', getStoryChapterById);
router.get('/story-chapters', getAllChapters);

router.patch('/story-chapters/:id', upload.single('image'), updateStoryChapter);

router.delete('/story-chapters/:id', deleteStoryChapter);

export default router;
