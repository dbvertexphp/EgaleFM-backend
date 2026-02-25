import express from 'express';
import UserModel from '../../../models/user/userModel.js';
import PromoCode from '../../../models/admin/promo/promo.model.js';
import SubscriptionPlan from '../../../models/admin/SubscriptionPlan/scriptionplan.model.js';
import { protect } from '../../../middleware/authMiddleware.js';
import { authorize } from '../../../middleware/Authorization.middleware.js';


const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      maxDiscount,
      minPurchase,
      usageLimit,
      expiryDate,
      applicableMonths,
    } = req.body;

    // Check karein ki code pehle se toh nahi hai
    const existingPromo = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existingPromo) {
      return res
        .status(400)
        .json({ success: false, message: 'Promo code already exists!' });
    }

    const newPromo = new PromoCode({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      maxDiscount: maxDiscount || 0,
      minPurchase: minPurchase || 0,
      usageLimit: usageLimit || 1000,
      expiryDate,
      applicableMonths: applicableMonths || [],
      isActive: true,
      usedCount: 0,
    });

    await newPromo.save();

    res.status(201).json({
      success: true,
      message: 'Promo Code Created Successfully!',
      data: newPromo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating promo code',
      error: error.message,
    });
  }
});

router.get('/list', async (req, res) => {
  try {
    const promos = await PromoCode.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: promos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.delete('/delete/:id', async (req, res) => {
  try {
    await PromoCode.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Promo deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
