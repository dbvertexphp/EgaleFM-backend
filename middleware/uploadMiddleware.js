// // import multer from 'multer';
// // import path from 'path';

// // // File kahan save hogi aur uska naam kya hoga
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, 'uploads/videos/'); // Ensure karein ki ye folder exists karta ho
// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, `${Date.now()}-${file.originalname}`);
// //   }
// // });

// // // Sirf video files allow karne ke liye filter
// // const fileFilter = (req, file, cb) => {
// //   if (file.mimetype.startsWith('video/')) {
// //     cb(null, true);
// //   } else {
// //     cb(new Error('Only video files are allowed!'), false);
// //   }
// // };

// // export const uploadVideoFile = multer({ storage, fileFilter });

// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // Folder check karne ke liye (taki crash na ho)
// const uploadDir = 'uploads/videos/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     // File extension maintain karne ke liye path.extname use karein
//     cb(
//       null,
//       `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
//     );
//   },
// });

// // ✅ Updated Filter: Video, Image aur PDF teeno allow karein
// const fileFilter = (req, file, cb) => {
//   const allowedMimeTypes = [
//     'video/mp4',
//     'video/mpeg',
//     'video/ogg',
//     'video/webm',
//     'video/quicktime', // Videos
//     'image/jpeg',
//     'image/png',
//     'image/jpg',
//     'image/webp', // Thumbnails
//     'application/pdf', // Notes
//   ];

//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     // Yahan hum custom message bhej rahe hain
//     cb(
//       new Error(
//         'Invalid file type! Only Video, Images (JPG/PNG), and PDFs are allowed.'
//       ),
//       false
//     );
//   }
// };

// export const uploadVideoFile = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 100 * 1024 * 1024, // Limit: 100MB (Aap ise badha sakte hain)
//   },
// });

// import multer from 'multer';
// import path from 'path';

// // File kahan save hogi aur uska naam kya hoga
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/videos/'); // Ensure karein ki ye folder exists karta ho
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// // Sirf video files allow karne ke liye filter
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('video/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only video files are allowed!'), false);
//   }
// };

// export const uploadVideoFile = multer({ storage, fileFilter });

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Folder check karne ke liye (taki crash na ho)
const uploadDir = 'uploads/videos/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // File extension maintain karne ke liye path.extname use karein
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
    );
  },
});

// ✅ Updated Filter: Video, Image aur PDF teeno allow karein
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'video/mp4',
    'video/mpeg',
    'video/ogg',
    'video/webm',
    'video/quicktime', // Videos
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp', // Thumbnails
    'application/pdf', // Notes
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Yahan hum custom message bhej rahe hain
    cb(
      new Error(
        'Invalid file type! Only Video, Images (JPG/PNG), and PDFs are allowed.'
      ),
      false
    );
  }
};

export const uploadVideoFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // Limit: 100MB (Aap ise badha sakte hain)
  },
});
