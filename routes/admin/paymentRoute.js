import express from 'express';
import { protect } from '../../middleware/authMiddleware.js';
import { authorize } from '../../middleware/Authorization.middleware.js';
import { getAllPayments } from '../../controllers/admin/Payment/paymeny.controller.js';

const router = express.Router();
router.use(protect);
router.use(authorize('admin'));

router.get('/payments-list', getAllPayments);
 
export default router;