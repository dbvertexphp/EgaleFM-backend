import mongoose from 'mongoose';
import Video from '../../../models/admin/Video/video.model.js';
import VideoProgress from '../../../models/admin/Video/videoprogess.js';





export const createVideo = async (req, res, next) => {
  try {
    const {
      courseId,
      subjectId,
      subSubjectId,
      topicId,
      chapterId,
      title,
      description,
      order,
    } = req.body;

    if (!topicId) {
      return res
        .status(400)
        .json({ success: false, message: 'Topic ID is missing!' });
    }

    if (!req.files || !req.files.video) {
      return res
        .status(400)
        .json({ success: false, message: 'Please upload a video file' });
    }
    // ================= HIERARCHY VALIDATION =================

    // 1️⃣ Validate Subject
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Subject' });
    }

    // 2️⃣ Validate SubSubject belongs to Subject
    const subSubject = await SubSubject.findOne({
      _id: subSubjectId,
      subjectId: subjectId,
    });
    if (!subSubject) {
      return res.status(400).json({
        success: false,
        message: 'SubSubject does not belong to Subject',
      });
    }

    // 3️⃣ Validate Chapter belongs to SubSubject
    const chapter = await Chapter.findOne({
      _id: chapterId,
      subSubjectId: subSubjectId,
    });
    if (!chapter) {
      return res.status(400).json({
        success: false,
        message: 'Chapter does not belong to SubSubject',
      });
    }

    // 4️⃣ Validate Topic belongs to Chapter
    const topic = await Topic.findOne({
      _id: topicId,
      chapterId: chapterId,
    });
    if (!topic) {
      return res
        .status(400)
        .json({ success: false, message: 'Topic does not belong to Chapter' });
    }

    // --- YE BADLAV KAREIN (Path Cleaning) ---
    // .replace(/\\/g, '/') ensures ki Windows wale slash ( \ ) forward slash ( / ) ban jayein
    const videoUrl = req.files.video[0].path.replace(/\\/g, '/');
    const thumbnailUrl = req.files.thumbnail
      ? req.files.thumbnail[0].path.replace(/\\/g, '/')
      : null;
    const notesUrl = req.files.notes
      ? req.files.notes[0].path.replace(/\\/g, '/')
      : null;
    // Auto order generation
    let finalOrder;

    if (order !== undefined && order !== null) {
      finalOrder = Number(order);
    } else {
      const lastVideo = await Video.findOne({ topicId }).sort({ order: -1 });
      finalOrder = lastVideo ? lastVideo.order + 1 : 1;
    }

    const video = await Video.create({
      courseId,
      subjectId,
      subSubjectId,
      topicId,
      chapterId,
      title,
      description,
      videoUrl, // Ab ye "uploads/videos/name.mp4" jaisa save hoga
      thumbnailUrl,
      notesUrl,
      order: finalOrder,
      createdBy: req.admin._id,
      updatedBy: req.admin._id,
    });

    res.status(201).json({
      success: true,
      message: 'Video saved successfully',
      data: video,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @desc    Update video details and files
 */
export const updateVideo = async (req, res, next) => {
  try {
    const { title, description, order, status } = req.body;
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: 'Video not found' });
    }

    // Agar nayi files upload hui hain toh update karein
    if (req.files) {
      if (req.files.video)
        video.videoUrl = req.files.video[0].path.replace(/\\/g, '/');

      if (req.files.thumbnail)
        video.thumbnailUrl = req.files.thumbnail[0].path.replace(/\\/g, '/');

      if (req.files.notes)
        video.notesUrl = req.files.notes[0].path.replace(/\\/g, '/');
    }

    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (order !== undefined) {
      const existing = await Video.findOne({
        topicId: video.topicId,
        order: order,
        _id: { $ne: video._id },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Another video already has this order in this topic',
        });
      }

      video.order = Number(order);
    }

    if (status) video.status = status;
    video.updatedBy = req.admin._id;

    await video.save();

    res.status(200).json({
      success: true,
      message: 'Video updated successfully',
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllVideos = async (req, res, next) => {
  try {
    // 1. topicId ko bhi query se nikalein
    const { subjectId, subSubjectId, chapterId, topicId, status } = req.query;

    const filter = {};
    if (subjectId) filter.subjectId = subjectId;
    if (subSubjectId) filter.subSubjectId = subSubjectId;
    if (chapterId) filter.chapterId = chapterId;
    if (topicId) filter.topicId = topicId;
    if (status) filter.status = status;

    const videos = await Video.find(filter)
      .populate('courseId', 'name')
      .populate('subjectId', 'name')
      .populate('subSubjectId', 'name')
      .populate('chapterId', 'name')
      .populate('topicId', 'name') // 3. Agar topic ka naam chahiye toh populate karein
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    next(error);
  }
};

export const getChapterVideoByChapterId = async (req, res, next) => {
  try {
    const { chapterId } = req.params;
    const userId = req.user?._id;

    const { status } = req.query;

    // ✅ Validate chapterId
    if (!mongoose.Types.ObjectId.isValid(chapterId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid chapterId',
      });
    }

    const filter = {
      chapterId,
    };

    if (status) filter.status = status;

    // ✅ Fetch videos
    const videos = await Video.find(filter)
      .populate('courseId', 'name')
      .populate('subjectId', 'name')
      .populate('subSubjectId', 'name')
      .populate('chapterId', 'name')
      .populate('topicId', 'name')

      .sort({ order: 1 });
    // 🔥 User progress fetch
    let progressMap = {};

    if (userId && videos.length > 0) {
      const progresses = await VideoProgress.find({
        userId,
        videoId: { $in: videos.map((v) => v._id) },
      }).lean();

      progresses.forEach((p) => {
        progressMap[p.videoId.toString()] = p;
      });
    }

    // 🔥 Merge progress into videos
    const formattedVideos = videos.map((video) => {
      const progress = progressMap[video._id.toString()];

      let videoStatus = 'UNATTENDED';

      let pausedAt = null;
      let watchPercentage = 0;
      let watchTime = 0;
      let totalDuration = 0;

      if (progress) {
        if (progress.status === 'completed') {
          videoStatus = 'COMPLETED';
        } else if (progress.status === 'watching') {
          videoStatus = 'PAUSED';
          pausedAt = progress.updatedAt; // 👈 pause timestamp
        }

        watchPercentage = progress.percentage || 0;
        watchTime = progress.watchTime || 0;
        totalDuration = progress.totalDuration || 0;
      }

      return {
        ...video.toObject(),
        userProgress: {
          status: videoStatus,
          pausedAt,
          watchPercentage,
          watchTime,
          totalDuration,
        },
      };
    });

    res.status(200).json({
      success: true,
      count: videos.length,
      data: formattedVideos,
    });
  } catch (error) {
    next(error);
  }
};

export const getVideoData = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId)
      .populate('courseId', 'name')
      .populate('subjectId', 'name')
      .populate('subSubjectId', 'name')
      .populate('chapterId', 'name')
      .populate('topicId', 'name');

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    next(error);
  }
};
