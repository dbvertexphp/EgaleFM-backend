import express from 'express';
const router = express.Router();
import { uploadVideoFile } from '../../../middleware/uploadMiddleware.js';
import { protect } from '../../../middleware/authMiddleware.js';
import { authorize } from '../../../middleware/Authorization.middleware.js';

import {
  createVideo,
  getAllVideos,
  deleteVideo,
  updateVideo,
  getVideoData,
} from '../../../controllers/admin/Video/video.controller.js';

/**
 * @swagger
 * tags:
 *   name: Admin Video Management
 *   description: APIs for Managing Video Lectures, Thumbnails, and PDF Notes
 */

// Sabhi routes protected hain aur sirf admin ke liye hain
router.use(protect);
router.use(authorize('admin'));

/**
 * @swagger
 * /api/admin/videos:
 *   post:
 *     summary: Create a new video lecture with thumbnail and notes
 *     tags: [Admin Video Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - courseId
 *               - subjectId
 *               - video
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               courseId:
 *                 type: string
 *               subjectId:
 *                 type: string
 *               subSubjectId:
 *                 type: string
 *               chapterId:
 *                 type: string
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: MP4/WebM video file
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Image file for video thumbnail
 *               notes:
 *                 type: string
 *                 format: binary
 *                 description: PDF file for lecture notes
 *     responses:
 *       201:
 *         description: Video lecture created successfully
 */
router.post(
  '/',
  uploadVideoFile.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
    { name: 'notes', maxCount: 1 },
  ]),
  createVideo
);

/**
 * @swagger
 * /api/admin/videos:
 *   get:
 *     summary: Get all video lectures
 *     tags: [Admin Video Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: chapterId
 *         schema:
 *           type: string
 *         description: Filter videos by chapter ID
 *     responses:
 *       200:
 *         description: List of videos fetched successfully
 */
router.get('/', getAllVideos);

/**
 * @swagger
 * /api/admin/videos/{id}:
 *   put:
 *     summary: Update video details or replace files
 *     tags: [Admin Video Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               video:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               notes:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video updated successfully
 */
router.put(
  '/:id',
  uploadVideoFile.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
    { name: 'notes', maxCount: 1 },
  ]),
  updateVideo
);

/**
 * @swagger
 * /api/admin/videos/{id}:
 *   delete:
 *     summary: Delete a video lecture
 *     tags: [Admin Video Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video deleted successfully
 */
router.delete('/:id', deleteVideo);
router.get('/:videoId', getVideoData);

export default router;
