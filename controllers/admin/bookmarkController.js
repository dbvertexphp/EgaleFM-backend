import Bookmark from '../../models/admin/bookmarkModel.js';

/**
 * common validation helper
 */
const validateBookmark = ({ type, mcqId, chapterId, subSubjectId }) => {
  if (!type) return 'type is required';

  if (type === 'mcq' && !mcqId) return 'mcqId is required';
  if (type === 'chapter' && !chapterId) return 'chapterId is required';
  if (type === 'sub-subject' && !subSubjectId)
    return 'subSubjectId is required';

  return null;
};

/**
 * @route   POST /api/bookmarks
 */
export const addBookmark = async (req, res) => {
  try {
    const error = validateBookmark(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const bookmark = await Bookmark.create({
      userId: req.user._id,
      type: req.body.type,
      mcqId: req.body.type === 'mcq' ? req.body.mcqId : null,
      chapterId: req.body.type === 'chapter' ? req.body.chapterId : null,
      subSubjectId:
        req.body.type === 'sub-subject' ? req.body.subSubjectId : null,
    });

    res.status(201).json({
      success: true,
      message: 'Bookmark added',
      bookmark,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: 'Already bookmarked' });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   DELETE /api/bookmarks
 */
export const removeBookmark = async (req, res) => {
  try {
    const error = validateBookmark(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    await Bookmark.findOneAndDelete({
      userId: req.user._id,
      type: req.body.type,
      mcqId: req.body.type === 'mcq' ? req.body.mcqId : null,
      chapterId: req.body.type === 'chapter' ? req.body.chapterId : null,
      subSubjectId:
        req.body.type === 'sub-subject' ? req.body.subSubjectId : null,
    });

    res.json({ success: true, message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/bookmarks
 */
export const getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id })
      .populate('mcqId')
      .populate('chapterId')
      .populate('subSubjectId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookmarks.length,
      bookmarks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/bookmarks/toggle
 */
// export const toggleBookmark = async (req, res) => {
//   try {
//     const error = validateBookmark(req.body);
//     if (error) {
//       return res.status(400).json({ success: false, message: error });
//     }

//     const query = {
//       userId: req.user._id,
//       type: req.body.type,
//       mcqId: req.body.type === 'mcq' ? req.body.mcqId : null,
//       chapterId: req.body.type === 'chapter' ? req.body.chapterId : null,
//       subSubjectId:
//         req.body.type === 'sub-subject' ? req.body.subSubjectId : null,
//     };

//     const existing = await Bookmark.findOne(query);

//     if (existing) {
//       await existing.deleteOne();
//       return res.json({
//         success: true,
//         message: 'Bookmark removed',
//         bookmarked: false,
//       });
//     }

//     await Bookmark.create(query);
//     res.json({
//       success: true,
//       message: 'Bookmark added',
//       bookmarked: true,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


export const getBookmarkSummary = async (req, res) => {
  try {
    // const { userId } = req.query; // Ab Query se userId lenge
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const counts = await Bookmark.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const result = { all: 0, important: 0, veryimportant: 0, mostimportant: 0 };
    counts.forEach(item => {
      if (result.hasOwnProperty(item._id)) {
        result[item._id] = item.count;
      }
      result.all += item.count;
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ 2. Get Bookmarks List (Folder wise ya "All")
export const getBookmarksList = async (req, res) => {
  try {
    // const { userId, category } = req.query; // Query se userId aur category
    const { type, itemId, category } = req.body;
    const userId = req.user._id; // ✅ Wapas token se ID lene lage


    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    let filter = { userId };
    if (category && category !== "all") {
      filter.category = category;
    }

    const list = await Bookmark.find(filter)
      .populate("mcqId")
      .populate("topicId")
      .populate("chapterId")
      .populate("subSubjectId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ 3. Toggle Bookmark (Add/Remove Logic)
export const toggleBookmark = async (req, res) => {
  try {
    const { userId, type, itemId, category } = req.body;

    if (!userId || !type || !category) {
      return res.status(400).json({ success: false, message: "userId, type and category are required" });
    }

    let query = { userId, type, category };
    if (type === "mcq") query.mcqId = itemId;
    else if (type === "topic") query.topicId = itemId;
    else if (type === "chapter") query.chapterId = itemId;
    else if (type === "sub-subject") query.subSubjectId = itemId;

    const existing = await Bookmark.findOne(query);

    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return res.status(200).json({ success: true, message: `Removed from ${category}` });
    } else {
      await Bookmark.create(query);
      return res.status(201).json({ success: true, message: `Added to ${category}` });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};