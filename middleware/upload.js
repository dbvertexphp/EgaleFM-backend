// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // 📁 Folders
// // ✅ Absolute base path (VERY IMPORTANT)
// const __dirname = path.resolve();

// // 📁 Absolute folders (Production Safe)
// const chapterImageDir = path.join(__dirname, 'uploads/story-chapter-image');
// const storyAudioDir = path.join(__dirname, 'uploads/story-audio');
// const userStoryDir = path.join(__dirname, 'uploads/user-stories');

// // Ensure directories exist
// [chapterImageDir, storyAudioDir, userStoryDir].forEach((dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// });

// // 🗂 Storage Config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (req.originalUrl.includes('upload-audio')) {
//       return cb(null, storyAudioDir);
//     }

//     if (req.originalUrl.includes('story-topics')) {
//       return cb(null, storyAudioDir);
//     }

//     if (req.originalUrl.includes('create-story')) {
//       return cb(null, userStoryDir);
//     }

//     return cb(null, chapterImageDir);
//   },

//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname).toLowerCase();

//     let prefix = 'file';

//     if (req.originalUrl.includes('story-topics')) {
//       prefix = 'audio';
//     } else if (req.originalUrl.includes('story-chapters')) {
//       prefix = 'chapter';
//     } else if (req.originalUrl.includes('create-story')) {
//       prefix = 'story'; // ✅ NEW
//     }

//     const uniqueName = `${prefix}-${Date.now()}-${Math.round(
//       Math.random() * 1e9
//     )}${ext}`;

//     cb(null, uniqueName);
//   },
// });

// // 🛡 File Filter
// const fileFilter = (req, file, cb) => {
//   const imageTypes = /jpg|jpeg|png|webp/;
//   const audioTypes = /mp3|wav|mpeg/;
//   const textTypes = /txt|doc|docx|pdf/; // ✅ NEW

//   const ext = path.extname(file.originalname).toLowerCase();
//   const mime = file.mimetype;
//   // 🎧 AUDIO — Admin Upload Story Audio
//   if (req.originalUrl.includes('upload-audio')) {
//     const isAudio =
//       audioTypes.test(ext) && (mime.includes('audio') || audioTypes.test(mime));

//     if (!isAudio) {
//       return cb(new Error('Only audio files (mp3, wav) allowed'));
//     }

//     return cb(null, true);
//   }
//   // 🎧 AUDIO — Story Topics
//   if (req.originalUrl.includes('story-topics')) {
//     const isAudio =
//       audioTypes.test(ext) && (mime.includes('audio') || audioTypes.test(mime));

//     if (!isAudio) {
//       return cb(new Error('Only audio files (mp3, wav) allowed'));
//     }

//     return cb(null, true);
//   }

//   // 📄 TEXT — User Stories
//   if (req.originalUrl.includes('create-story')) {
//     const isText =
//       textTypes.test(ext) ||
//       mime.includes('text') ||
//       mime.includes('pdf') ||
//       mime.includes('word');

//     if (!isText) {
//       return cb(new Error('Only text files (txt, doc, docx, pdf) are allowed'));
//     }

//     return cb(null, true);
//   }

//   // 🖼 IMAGE — Chapters
//   const isImage =
//     imageTypes.test(ext) && (mime.includes('image') || imageTypes.test(mime));

//   if (!isImage) {
//     return cb(new Error('Only image files allowed'));
//   }

//   cb(null, true);
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 20 * 1024 * 1024,
//   },
// });

// export default upload;

import multer from 'multer';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

/* ===============================
   📁 UPLOAD DIRECTORIES
================================ */
const uploadPaths = {
  coverImage: path.join(__dirname, 'uploads/story-cover'),
  chapterImages: path.join(__dirname, 'uploads/story-chapter-image'),
  audioFile: path.join(__dirname, 'uploads/story-audio'),
  textFile: path.join(__dirname, 'uploads/user-stories'),
};

// Ensure folders exist
Object.values(uploadPaths).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/* ===============================
   🗂 STORAGE CONFIG
================================ */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = uploadPaths[file.fieldname];

    if (!folder) {
      return cb(new Error('Invalid upload field'));
    }

    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();

    const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;

    cb(null, uniqueName);
  },
});

/* ===============================
   🛡 FILE FILTER
================================ */
const fileFilter = (req, file, cb) => {
  const imageTypes = /jpg|jpeg|png|webp/;
  const audioTypes = /mp3|wav|mpeg/;
  const textTypes = /txt|doc|docx|pdf/;

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  // COVER IMAGE + CHAPTER IMAGE
  if (file.fieldname === 'coverImage' || file.fieldname === 'chapterImages') {
    const isImage = imageTypes.test(ext) && mime.startsWith('image/');

    if (!isImage) {
      return cb(new Error('Only image files allowed (jpg, png, webp)'));
    }

    return cb(null, true);
  }

  // AUDIO
  if (file.fieldname === 'audioFile') {
    const isAudio = audioTypes.test(ext) && mime.startsWith('audio/');

    if (!isAudio) {
      return cb(new Error('Only audio files allowed (mp3, wav)'));
    }

    return cb(null, true);
  }

  // TEXT FILE
  if (file.fieldname === 'textFile') {
    const isText =
      textTypes.test(ext) ||
      mime.includes('text') ||
      mime.includes('pdf') ||
      mime.includes('word');

    if (!isText) {
      return cb(new Error('Only text files allowed (txt, doc, docx, pdf)'));
    }

    return cb(null, true);
  }

  cb(new Error('Invalid file type'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

export default upload;
