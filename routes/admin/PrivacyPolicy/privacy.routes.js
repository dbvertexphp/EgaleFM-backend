// import express from 'express';
// const router = express.Router();
// import { protect } from '../../../middleware/authMiddleware.js';
// import { authorize } from '../../../middleware/Authorization.middleware.js';
// import { addPrivacyPolicy, getPrivacyPolicy } from '../../../controllers/admin/PrivacyPolicy/privacy.controller.js';

// router.use(protect);
// router.use(authorize('admin'));
// router.post('/privacy-policy', addPrivacyPolicy);
// router.get('/privacy-policy', getPrivacyPolicy);

// export default router;



import express from 'express';
const router = express.Router();
import { protect } from '../../../middleware/authMiddleware.js';
import { authorize } from '../../../middleware/Authorization.middleware.js';
import { addPrivacyPolicy, getPrivacyPolicy } from '../../../controllers/admin/PrivacyPolicy/privacy.controller.js';

/**
 * @swagger
 * tags:
 *   name: Admin Settings
 *   description: Management of App Policies (About Us, Privacy Policy, Terms)
 */

// Sabhi routes protected hain aur sirf admin ke liye hain
router.use(protect);
router.use(authorize('admin'));

/**
 * @swagger
 * /api/admin/privacy/privacy-policy:
 *   post:
 *     summary: Create or Update Privacy Policy
 *     description: This API allows the admin to set or update the application's privacy policy.
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
 *                 description: The text or HTML content of the privacy policy
 *                 example: "Your privacy is important to us. We collect minimal data..."
 *     responses:
 *       200:
 *         description: Privacy Policy saved successfully
 *       401:
 *         description: Unauthorized - Token missing
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/privacy-policy', addPrivacyPolicy);

/**
 * @swagger
 * /api/admin/privacy/privacy-policy:
 *   get:
 *     summary: Get the current Privacy Policy
 *     description: Fetch the existing privacy policy content for viewing or editing.
 *     tags: [Admin Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Privacy Policy fetched successfully
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
 *         description: Privacy Policy not found
 */
router.get('/privacy-policy', getPrivacyPolicy);

export default router;