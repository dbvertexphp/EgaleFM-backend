import Transaction from '../../../models/admin/Transaction/Transaction.js';

export const getAllPayments = async (req, res, next) => {
  try {
    // Sabhi transactions ko fetch karna aur user/plan ki details populate karna
    const transactions = await Transaction.find()
      .populate('userId', 'name email mobile') // User ka naam aur contact info
      .populate('planId', 'name') // Plan ka naam
      .sort({ createdAt: -1 }); // Latest payment pehle dikhegi

    // Data ko format karna taaki admin ko sahi info mile
    const paymentList = transactions.map((trans) => {
      const buyDate = new Date(trans.createdAt);
      const expiryDate = new Date(trans.createdAt);
      expiryDate.setMonth(expiryDate.getMonth() + trans.months);

      return {
        transactionId: trans.razorpay_payment_id,
        orderId: trans.razorpay_order_id,
        userName: trans.userId ? trans.userId.name : 'Unknown User',
        userEmail: trans.userId ? trans.userId.email : 'N/A',
        planName: trans.planId ? trans.planId.name : 'Deleted Plan',
        amount: trans.amount,
        duration: `${trans.months} Months`,
        buyDate: trans.createdAt, // ✅ raw ISO date
        expiryDate: expiryDate, // ✅ raw ISO date
        status: trans.status,
      };
    });

    res.status(200).json({
      success: true,
      count: paymentList.length,
      data: paymentList,
    });
  } catch (error) {
    next(error);
  }
};
