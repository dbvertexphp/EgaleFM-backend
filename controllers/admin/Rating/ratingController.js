import Rating from "../../../models/admin/Rating";



export const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate('userId', 'name email image') // User ki details fetch karne ke liye
      .sort({ createdAt: -1 }); // Latest ratings sabse upar

    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};