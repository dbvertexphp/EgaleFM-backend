import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 📁 Folders
const chapterImageDir = 'uploads/story-chapter-image';
const storyAudioDir = 'uploads/story-audio';

// Ensure directories exist
[chapterImageDir, storyAudioDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 🗂 Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.originalUrl.includes('story-topics')) {
      cb(null, storyAudioDir);
    } else {
      cb(null, chapterImageDir);
    }
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();

    let prefix = 'file';

    if (req.originalUrl.includes('story-topics')) {
      prefix = 'audio';
    } else if (req.originalUrl.includes('story-chapters')) {
      prefix = 'chapter';
    }

    const uniqueName = `${prefix}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;

    cb(null, uniqueName);
  },
});

// 🛡 File Filter
const fileFilter = (req, file, cb) => {
  const imageTypes = /jpg|jpeg|png|webp/;
  const audioTypes = /mp3|wav|mpeg/;

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (req.originalUrl.includes('story-topics')) {
    const isAudio =
      audioTypes.test(ext) && (mime.includes('audio') || audioTypes.test(mime));

    if (!isAudio) {
      return cb(new Error('Only audio files (mp3, wav) allowed'));
    }

    return cb(null, true);
  }

  const isImage =
    imageTypes.test(ext) && (mime.includes('image') || imageTypes.test(mime));

  if (!isImage) {
    return cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

export default upload;
