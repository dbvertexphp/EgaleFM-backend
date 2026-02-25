// import express from "express";
// const router = express.Router();
// import { protect } from '../../../middleware/authMiddleware.js';
// import { authorize } from '../../../middleware/Authorization.middleware.js';

// // 1. Controller Imports (Comma check karein)
// import {
//   createSubscriptionPlan,
//   updateSubscriptionPlan,
//   buySubscriptionPlan,
//   getAllPlansForAdmin,
//   getAllTransactionsForAdmin
// } from "../../../controllers/admin/Subscription/subscription.controller.js";


// router.use(protect);

// router.post("/buy-plan", buySubscriptionPlan);

// router.use(authorize('admin'));

// router.post("/create-plan", createSubscriptionPlan);
// router.put("/update-plan/:planId", updateSubscriptionPlan);
// router.get("/admin/all-plans", getAllPlansForAdmin);
// router.get("/admin/transactions", getAllTransactionsForAdmin);

// export default router;


import express from "express";
const router = express.Router();
import { protect } from '../../../middleware/authMiddleware.js';
import { authorize } from '../../../middleware/Authorization.middleware.js';

// Controller Imports
import {
  createSubscriptionPlan,
  updateSubscriptionPlan,
  buySubscriptionPlan,
  getAllPlansForAdmin,
  getAllTransactionsForAdmin
  
} from "../../../controllers/admin/Subscription/subscription.controller.js";

/**
 * @swagger
 * tags:
 *   name: Subscription Management
 *   description: APIs for Managing Subscription Plans and User Purchases
 */

// Sabhi subscription routes ke liye login hona zaroori hai
router.use(protect);

/**
 * @swagger
 * /api/plans/buy-plan:
 *   post:
 *     summary: Purchase a subscription plan (User)
 *     description: Allows a logged-in user to subscribe to a specific plan.
 *     tags: [Subscription Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *             properties:
 *               planId:
 *                 type: string
 *                 description: The ID of the plan to buy
 *               paymentId:
 *                 type: string
 *                 description: Transaction/Payment reference ID
 *     responses:
 *       200:
 *         description: Subscription successful
 *       401:
 *         description: Unauthorized
 */
router.post("/buy-plan", buySubscriptionPlan);

// Niche ke saare routes ke liye Admin hona zaroori hai
router.use(authorize('admin'));

/**
 * @swagger
 * /api/plans/create-plan:
 *   post:
 *     summary: Create a new subscription plan (Admin)
 *     tags: [Subscription Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - durationDays
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Premium Monthly"
 *               price:
 *                 type: number
 *               durationDays:
 *                 type: number
 *                 description: Plan validity in days
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Plan created successfully
 */
router.post("/create-plan", createSubscriptionPlan);

/**
 * @swagger
 * /api/plans/update-plan/{planId}:
 *   put:
 *     summary: Update an existing plan (Admin)
 *     tags: [Subscription Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Plan updated successfully
 */
router.put("/update-plan/:planId", updateSubscriptionPlan);

/**
 * @swagger
 * /api/plans/admin/all-plans:
 *   get:
 *     summary: Get all plans for administration (Admin)
 *     tags: [Subscription Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all plans fetched
 */
router.get("/admin/all-plans", getAllPlansForAdmin);

/**
 * @swagger
 * /api/plans/admin/transactions:
 *   get:
 *     summary: View all purchase transactions (Admin)
 *     tags: [Subscription Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction history fetched successfully
 */
router.get("/admin/transactions", getAllTransactionsForAdmin);

export default router;