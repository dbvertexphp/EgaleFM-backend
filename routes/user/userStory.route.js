import express from 'express';
import { createUserStory } from '../../controllers/user/userStory.controller.js';
import { uploadStoryFile } from '../../middleware/upload.js';
import { userAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/create-story',
  userAuth,
  uploadStoryFile.single('textFile'),
  createUserStory
);

export default router;
