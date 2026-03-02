import Admin from '../../models/admin/admin.model.js';
import generateToken from '../../config/generateToken.js';
import PageModel from '../../models/admin/pageModel.js';
import UserModel from '../../models/user/userModel.js';
import Rating from '../../models/admin/Rating.js';
import User from '../../models/user/userModel.js';
import Payment from '../../models/admin/Transaction/Transaction.js';
import StoryCategory from '../../models/admin/Category/category.model.js';
import StoryChapter from '../../models/admin/Story-chapter/storyChapter.model.js';
import StoryTopic from '../../models/admin/Story-Topic/storyTopic.model.js';
import UserStory from '../../models/user/UserStory.model.js';
import Notification from '../../models/user/Notification.model.js';

export const loginAdmin = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    email = email.toLowerCase().trim(); // 🔹 FIX 1

    const admin = await Admin.findOne({
      email,
      role: 'admin',
    }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    if (admin.status !== 'active') {
      // 🔹 FIX 2
      return res.status(403).json({
        success: false,
        message: 'Admin account is inactive',
      });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const { accessToken } = generateToken(admin._id);

    admin.token = accessToken;
    admin.lastLogin = new Date(); // 🔹 FIX 3
    await admin.save();
    res.status(200).json({
      success: true,
      token: accessToken,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * GET LOGGED-IN ADMIN PROFILE
 */
export const getAdminProfile = async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select('-password');

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: 'Admin not found',
    });
  }

  res.json({
    success: true,
    data: admin,
  });
};

/**
 * UPDATE ADMIN PROFILE (SELF)
 * Allowed fields only
 */
// UPDATE ADMIN PROFILE (SELF)
export const updateAdminProfile = async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: 'Admin not found',
    });
  }

  // text fields
  if (req.body.name) admin.name = req.body.name;
  if (req.body.phone) admin.phone = req.body.phone;

  // image upload (NEW)
  if (req.file) {
    admin.profileImage = `/uploads/admin-profile/${req.file.filename}`;
  }

  await admin.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      profileImage: admin.profileImage,
      role: admin.role,
    },
  });
};

/**
 * CHANGE ADMIN PASSWORD
 */
export const changeAdminPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required',
    });
  }

  const admin = await Admin.findById(req.admin._id).select('+password');

  const isMatch = await admin.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: 'New password must be different from old password',
    });
  }

  admin.password = newPassword;
  admin.token = null; // invalidate old token
  await admin.save();

  res.json({
    success: true,
    message: 'Password changed successfully. Please login again.',
  });
};
export const addSlug = async (req, res, next) => {
  try {
    const { slug, title, content } = req.body;

    if (!slug || !title || !content) {
      return res.status(400).json({
        message: 'slug, title and content are required',
      });
    }

    const existingPage = await PageModel.findOne({ slug });

    if (existingPage) {
      existingPage.title = title;
      existingPage.content = content;

      await existingPage.save();

      return res.status(200).json({
        message: 'Page updated successfully',
        data: existingPage,
      });
    }

    const page = await PageModel.create({
      slug,
      title,
      content,
    });

    res.status(201).json({
      message: 'Page created successfully',
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

// ───────────────────────────────────────────────
// GET ALL USERS (ADMIN PANEL)
// ───────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    // Only admin allowed
    if (!req.admin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access only',
      });
    }

    const users = await UserModel.find()
      .select('-password -otp -otpExpiresAt -refreshToken')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Get users error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

export const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate('userId', 'name email image') // User ki details fetch karne ke liye
      .sort({ createdAt: -1 }); // Latest ratings sabse upar

    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// controllers/admin/dashboard.controller.js
export const getDashboardStats = async (req, res) => {
  try {
    const [
      users,
      categories,
      publishedCategories,
      chapters,
      publishedChapters,
      topics,
      publishedTopics,
      payments,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),

      StoryCategory.countDocuments(),
      StoryCategory.countDocuments({ isPublished: true }),

      StoryChapter.countDocuments(),
      StoryChapter.countDocuments({ isPublished: true }),

      StoryTopic.countDocuments(),
      StoryTopic.countDocuments({ isPublished: true }),

      Payment.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        categories,
        publishedCategories,
        chapters,
        publishedChapters,
        topics,
        publishedTopics,
        payments,
      },
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message,
    });
  }
};

// UPDATE STORY STATUS (ADMIN)
// export const updateStoryStatus = async (req, res, next) => {
//   try {
//     const { status, adminRemark } = req.body;

//     if (!['approved', 'rejected'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status',
//       });
//     }

//     const story = await UserStory.findById(req.params.id);

//     if (!story) {
//       return res.status(404).json({
//         success: false,
//         message: 'Story not found',
//       });
//     }

//     story.status = status;
//     story.adminRemark = adminRemark || '';

//     await story.save();

//     res.status(200).json({
//       success: true,
//       message: `Story ${status} successfully`,
//       data: story,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const updateStoryStatus = async (req, res, next) => {
  try {
    const { status, adminRemark } = req.body;

    const normalizedStatus = status?.toLowerCase();

    if (!['pending', 'approved', 'rejected'].includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const story = await UserStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    story.status = normalizedStatus;
    story.adminRemark = adminRemark || '';

    await story.save();
    // 🔔 Send notification when story approved
    if (normalizedStatus === 'approved') {
      await Notification.create({
        user: story.user,
        title: 'Your Story Has Been Approved 🎉',
        message: `Your story "${story.title}" has been approved by admin.`,
        type: 'story_text_approved',
      });
    }
    res.status(200).json({
      success: true,
      message: `Story ${normalizedStatus} successfully`,
      data: story,
    });
  } catch (error) {
    next(error);
  }
};
// GET ALL USER STORIES (ADMIN)
export const getAllUserStories = async (req, res, next) => {
  try {
    const { status } = req.query;

    const filter = status ? { status } : {};

    const stories = await UserStory.find(filter)
      .populate('user', 'name email')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE USER STORY BY ID (ADMINs)
export const getUserStoryByIdAdmin = async (req, res, next) => {
  try {
    const story = await UserStory.findById(req.params.id)
      .populate('user', 'name email')
      .populate('category', 'name');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

// GET USERS WHO HAVE STORIES (ADMIN)

export const getUsersWithStories = async (req, res, next) => {
  try {
    const users = await UserStory.aggregate([
      {
        $group: {
          _id: '$user',
          storyCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users', // User collection name
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },

      {
        $project: {
          _id: '$user._id',
          name: '$user.name',
          email: '$user.email',
          storyCount: 1,
        },
      },
      { $sort: { storyCount: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// GET STORIES OF A SPECIFIC USER (ADMIN)
export const getStoriesByUserAdmin = async (req, res, next) => {
  try {
    const stories = await UserStory.find({
      user: req.params.userId,
    })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN UPLOAD STORY AUDIO
export const uploadStoryAudio = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { audioTitle, audioDescription } = req.body;

    // 🔥 Convert boolean safely
    const isAudioPublished =
      req.body.isAudioPublished === 'true' ||
      req.body.isAudioPublished === true;

    if (!audioTitle || !audioDescription) {
      return res.status(400).json({
        success: false,
        message: 'Audio title and description are required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Audio file is required',
      });
    }

    const story = await UserStory.findById(storyId).populate('user');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    if (story.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Only approved stories can be converted to audio',
      });
    }

    // ✅ SAVE AUDIO
    story.audioTitle = audioTitle;
    story.audioDescription = audioDescription;
    story.audioFile = `/uploads/story-audio/${req.file.filename}`;
    story.isAudioPublished = isAudioPublished;

    if (isAudioPublished) {
      story.audioPublishedAt = new Date();
    } else {
      story.audioPublishedAt = null;
    }

    await story.save();

    // 🔔 Notify only if published
    if (isAudioPublished) {
      await Notification.create({
        user: story.user._id,
        title: 'Your Story is Now Available in Audio 🎧',
        message: `Your story "${story.title}" is now live in audio format.`,
        type: 'story_audio_published',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Audio ${isAudioPublished ? 'uploaded & published' : 'uploaded as draft'}`,
      data: story,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// ADMIN UNPUBLISH STORY AUDIO
export const unpublishStoryAudio = async (req, res, next) => {
  try {
    const { storyId } = req.params;

    const story = await UserStory.findById(storyId).populate('user');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    if (!story.isAudioPublished) {
      return res.status(400).json({
        success: false,
        message: 'Audio is already unpublished',
      });
    }

    // Optional: delete audio file from server
    if (story.audioFile) {
      const fs = await import('fs');
      const path = await import('path');

      const filePath = path.resolve().concat(story.audioFile);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Reset fields
    story.audioTitle = null;
    story.audioDescription = null;
    story.audioFile = null;
    story.isAudioPublished = false;
    story.audioPublishedAt = null;

    await story.save();

    // 🔔 Send notification
    await Notification.create({
      user: story.user._id,
      title: 'Story Audio Removed',
      message: `Audio version of your story "${story.title}" has been unpublished by admin.`,
      type: 'story_audio_published',
    });

    res.status(200).json({
      success: true,
      message: 'Story audio unpublished successfully',
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

// New Controller to Toggle Publish Status (Without deleting file)
export const toggleAudioPublish = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const story = await UserStory.findById(storyId);

    if (!story || !story.audioFile) {
      return res.status(404).json({
        success: false,
        message: 'Story or Audio file not found. Upload audio first.',
      });
    }

    // Toggle the status
    story.isAudioPublished = !story.isAudioPublished;
    if (story.isAudioPublished) {
      story.audioPublishedAt = new Date();
    }

    await story.save();

    res.status(200).json({
      success: true,
      message: `Audio ${story.isAudioPublished ? 'published' : 'unpublished'} successfully`,
      data: story,
    });
  } catch (error) {
    next(error);
  }
};
