import express from 'express';
import {
  addSlug,
  loginAdmin,
  getAllRatings,
} from '../../controllers/admin/admin.controller.js';
// import { validateAdminToken } from '../middleware/adminToken.middleware.js';

import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAllUsers,
  getDashboardStats,
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

export default router;
