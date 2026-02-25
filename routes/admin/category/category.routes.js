import express from 'express';
import { protect } from '../../../middleware/authMiddleware.js';
import { authorize } from '../../../middleware/Authorization.middleware.js';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  publishCategory,
  unpublishCategory,
} from '../../../controllers/admin/Category/category.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));
router.post('/categories', createCategory);
router.get('/categories', getAllCategories);
router.get('/categories/:id', getCategoryById);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.patch('/categories/:id/publish', publishCategory);
router.patch('/categories/:id/unpublish', unpublishCategory);

export default router;
