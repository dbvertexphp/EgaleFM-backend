// import express from 'express';
// const router = express.Router();
// import { protect } from '../../../middleware/authMiddleware.js';
// import { authorize } from '../../../middleware/Authorization.middleware.js';
// import {
//   addTerms,
//   getTerms,
// } from '../../../controllers/admin/Terms&Condition/terms.controller.js';

// // All routes are protected and require admin role
// router.use(protect);
// router.use(authorize('admin'));

// router.post('/terms-conditions', addTerms);
// router.get('/terms-conditions', getTerms);

// export default router;


import express from 'express';
const router = express.Router();
import { protect } from '../../../middleware/authMiddleware.js';
import { authorize } from '../../../middleware/Authorization.middleware.js';
import {
  addTerms,
  getTerms,
} from '../../../controllers/admin/Terms&Condition/terms.controller.js';

/**
 * @swagger
 * tags:
 *   name: Admin Settings
 *   description: Management of App Policies (About Us, Privacy Policy, Terms & Conditions)
 */

// Sabhi routes protected hain aur sirf admin ke liye hain
router.use(protect);
router.use(authorize('admin'));

/**
 * @swagger
 * /api/admin/terms/terms-conditions:
 *   post:
 *     summary: Add or Update Terms & Conditions
 *     description: This API allows the admin to set or update the application's terms and conditions. If they already exist, they will be updated.
 *     tags: [Admin Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: The full text or HTML content of the Terms & Conditions
 *                 example: "By using this app, you agree to follow our rules and regulations..."
 *     responses:
 *       200:
 *         description: Terms & Conditions saved successfully
 *       401:
 *         description: Unauthorized - Token missing
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/terms-conditions', addTerms);

/**
 * @swagger
 * /api/admin/terms/terms-conditions:
 *   get:
 *     summary: Get current Terms & Conditions
 *     description: Fetch the existing Terms & Conditions for the admin panel or user view.
 *     tags: [Admin Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Terms & Conditions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *       404:
 *         description: Terms & Conditions not found
 */
router.get('/terms-conditions', getTerms);

export default router;