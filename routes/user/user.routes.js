import express from 'express';
import {
  changePassword,
  forgetPassword,
  getSlugByQuery,
  getUserData,
  login,
  loginByGoogle,
  register,
  resendOtp,
  verifyEmail,
  verifyMobile,
  logout,
  getMe,
} from '../../controllers/user/userController.js';
import {
  createUserStory,
  getMyStories,
  getMyStoryById,
  toggleLikeStory,
  addCommentToStory,
  toggleLikeChapter,
  addCommentToChapter,
  getChapterComments,
} from '../../controllers/user/userStory.controller.js';

import { getAboutUs } from '../../controllers/admin/AboutUs/aboutus.controller.js';
import { getPrivacyPolicy } from '../../controllers/admin/PrivacyPolicy/privacy.controller.js';
import { getTerms } from '../../controllers/admin/Terms&Condition/terms.controller.js';
import uploadStoryFile from '../../middleware/upload.js';
import { protect } from '../../middleware/authMiddleware.js';
import {
  getMyNotifications,
  markNotificationAsRead,
} from '../../controllers/user/notification.controller.js';
import { otpLimiter } from '../../middleware/limiter.js';

const userRouter = express.Router();

userRouter.post('/google', loginByGoogle);

// Email registration flow
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - countryId
 *               - stateId
 *               - cityId
 *               - collegeId
 *               - classId
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               mobile:
 *                 type: string
 *               address:
 *                 type: string
 *               countryId:
 *                 type: string
 *               stateId:
 *                 type: string
 *               cityId:
 *                 type: string
 *               collegeId:
 *                 type: string
 *               classId:
 *                 type: string
 *               admissionYear:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */

userRouter.post('/register', register);

userRouter.post('/verify-email', otpLimiter, verifyEmail);
userRouter.post('/verify-mobile', otpLimiter, verifyMobile);

userRouter.post('/resend-otp', otpLimiter, resendOtp);
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */

userRouter.post('/login', login);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user and invalidate token
 *     tags: [User Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       401:
 *         description: Unauthorized
 */
userRouter.post('/logout', protect, logout);
userRouter.get('/auth-me', protect, getMe);
userRouter.post('/forgot-password', otpLimiter, forgetPassword);
userRouter.post('/change-password', otpLimiter, changePassword);
userRouter.post(
  '/create-story',
  protect,
  uploadStoryFile.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'chapterImages', maxCount: 20 },
    { name: 'textFile', maxCount: 1 },
  ]),
  createUserStory
);

userRouter.get('/my-stories', protect, getMyStories);

userRouter.get('/my-stories/:id', protect, getMyStoryById);

userRouter.patch('/stories/:id/like', protect, toggleLikeStory);

userRouter.post('/stories/:id/comment', protect, addCommentToStory);

// LIKE / UNLIKE CHAPTER
userRouter.patch(
  '/stories/:storyId/chapters/:chapterId/like',
  protect,
  toggleLikeChapter
);

// ADD COMMENT TO CHAPTER
userRouter.post(
  '/stories/:storyId/chapters/:chapterId/comment',
  protect,
  addCommentToChapter
);

// GET CHAPTER COMMENTS
userRouter.get(
  '/stories/:storyId/chapters/:chapterId/comments',
  protect,
  getChapterComments
);

userRouter.get('/notifications', protect, getMyNotifications);

userRouter.patch('/notifications/:id/read', protect, markNotificationAsRead);

userRouter.get('/slug', getSlugByQuery);
userRouter.get('/about-us', getAboutUs);
userRouter.get('/privacy-policy', getPrivacyPolicy);
userRouter.get('/terms-conditions', getTerms);

userRouter.get('/profile/:id', protect, getUserData);

export default userRouter;
