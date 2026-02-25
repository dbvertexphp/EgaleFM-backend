// import express from 'express';

// import { protect } from '../../../middleware/authMiddleware.js';
// import { authorize } from '../../../middleware/Authorization.middleware.js';
// const router = express.Router();
// import {
//   addAboutUs,
//   getAboutUs,
// } from '../../../controllers/admin/AboutUs/aboutus.controller.js';
// router.use(protect);
// router.use(authorize('admin'));

// router.post('/about-us', addAboutUs); // POST used for both Add and Edit
// router.get('/about-us', getAboutUs); // GET for fetching data

// export default router;


import express from 'express';
import { protect } from '../../../middleware/authMiddleware.js';
import { authorize } from '../../../middleware/Authorization.middleware.js';
import {
  addAboutUs,
  getAboutUs,
} from '../../../controllers/admin/AboutUs/aboutus.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin Settings
 *   description: Management of About Us, Terms, and Privacy Policy
 */

// Sabhi routes ke liye authentication aur authorization lagana
router.use(protect);
router.use(authorize('admin'));

/**
 * @swagger
 * /api/admin/about-us:
 *   post:
 *     summary: Add or Update About Us content
 *     description: This API is used by admin to create or update the About Us section. If content already exists, it will be updated.
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
 *                 description: The HTML or plain text content for About Us
 *                 example: "Welcome to our Education App. We provide the best MCQs..."
 *     responses:
 *       200:
 *         description: About Us content saved successfully
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - User does not have admin rights
 */
router.post('/about-us', addAboutUs);

/**
 * @swagger
 * /api/admin/about-us:
 *   get:
 *     summary: Get About Us content
 *     description: Fetch the current About Us content for the admin panel.
 *     tags: [Admin Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: About Us data fetched successfully
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
 *       401:
 *         description: Unauthorized
 */
router.get('/about-us', getAboutUs);

export default router;