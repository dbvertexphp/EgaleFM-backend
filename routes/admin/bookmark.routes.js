// import express from 'express';
// import {
//   addBookmark,
//   removeBookmark,
//   getMyBookmarks,
//   toggleBookmark,
// } from '../../controllers//admin/bookmarkController.js';
// import { protect } from '../../middleware/authMiddleware.js';

// const router = express.Router();

// router.post('/', protect, addBookmark);
// router.delete('/', protect, removeBookmark);
// router.get('/', protect, getMyBookmarks);
// router.post('/toggle', protect, toggleBookmark);

// export default router;



import express from 'express';
import {
  addBookmark,
  removeBookmark,
  getMyBookmarks,
  toggleBookmark,
  getBookmarkSummary, getBookmarksList 
} from '../../controllers/admin/bookmarkController.js'; // Fixed double slash
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User Bookmarks
 *   description: APIs for users to save/bookmark MCQs, Pearls, or Chapters for later review
 */

// Sabhi routes login protected hain
router.use(protect);

/**
 * @swagger
 * /api/bookmarks:
 *   post:
 *     summary: Add a new bookmark
 *     tags: [User Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *               - itemType
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: The ID of the MCQ or Pearl being bookmarked
 *               itemType:
 *                 type: string
 *                 enum: [MCQ, Pearl]
 *                 description: Specify if the item is an MCQ or a Pearl
 *     responses:
 *       201:
 *         description: Bookmarked successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', addBookmark);

/**
 * @swagger
 * /api/bookmarks:
 *   delete:
 *     summary: Remove a bookmark
 *     tags: [User Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bookmarked item to remove
 *     responses:
 *       200:
 *         description: Bookmark removed successfully
 */
router.delete('/', removeBookmark);

/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: Get all bookmarked items of the logged-in user
 *     tags: [User Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookmarks fetched successfully
 */
router.get('/', getMyBookmarks);

/**
 * @swagger
 * /api/bookmarks/toggle:
 *   post:
 *     summary: Toggle bookmark status (Add/Remove)
 *     description: If the item is already bookmarked, it will be removed. If not, it will be added.
 *     tags: [User Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *             properties:
 *               itemId:
 *                 type: string
 *               itemType:
 *                 type: string
 *                 enum: [MCQ, Pearl]
 *     responses:
 *       200:
 *         description: Bookmark toggled successfully
 */
// router.post('/toggle', toggleBookmark);
router.post('/toggle', toggleBookmark);
router.get('/summary', getBookmarkSummary);
router.get('/list', getBookmarksList);

export default router;