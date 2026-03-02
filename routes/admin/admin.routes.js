import express from 'express';
import {
  addSlug,
  loginAdmin,
  updateStoryStatus,
  getAllRatings,
  uploadStoryAudio,
  unpublishStoryAudio
} from '../../controllers/admin/admin.controller.js';
// import { validateAdminToken } from '../middleware/adminToken.middleware.js';
import { getAllUserStories } from '../../controllers/admin/admin.controller.js';
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAllUsers,
  getDashboardStats,
  getUserStoryByIdAdmin,
  getUsersWithStories,
  getStoriesByUserAdmin
} from '../../controllers/admin/admin.controller.js';
import upload from '../../middleware/upload.js';
import { protect } from '../../middleware/authMiddleware.js';
import { authorize } from '../../middleware/Authorization.middleware.js';

const router = express.Router();

// Require a valid admin token header for login attempts
router.post('/login', loginAdmin);

// Get logged-in admin profile
router.get('/profile', protect, getAdminProfile);
// routes/admin/dashboard.routes.js
router.get('/dashboard/stats', protect, authorize('admin'), getDashboardStats);

// Update admin profile (name, phone, image)
router.put(
  '/profile',
  protect,
  upload.single('profileImage'),
  updateAdminProfile
);
// 👇 existing routes ke neeche add karo
router.get('/users', protect, getAllUsers);
// Change admin password
router.put('/change-password', protect, changeAdminPassword);

/*        slug api like privacy-policy, term condition, about us */
router.post('/slug', addSlug);

router.get('/all-ratings', getAllRatings);

// GET all stories
router.get('/user-stories', protect, getAllUserStories);

// Approve / Reject
router.patch(
  '/user-stories/:id/status',
  protect,

  updateStoryStatus
);

// USERS WITH STORY COUNT
router.get(
  '/users-with-stories',
  protect,
  authorize('admin'),
  getUsersWithStories
);

// STORIES OF SPECIFIC USER (FOR MODAL)
router.get(
  '/user-stories/by-user/:userId',
  protect,
  authorize('admin'),
  getStoriesByUserAdmin
);

router.get('/user-stories/:id', protect, getUserStoryByIdAdmin);


router.put(
  '/story/:storyId/upload-audio',
  protect,
  upload.single('audio'),
  uploadStoryAudio
);

router.put(
  '/story/:storyId/unpublish-audio',
  protect,
  unpublishStoryAudio
);

export default router;
