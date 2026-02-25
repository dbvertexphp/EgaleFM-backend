import multer from 'multer';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();
const uploadDir = path.join(__dirname, 'uploads/user-profile');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },

  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${req.user._id}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

// file filter (images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const uploadProfile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export default uploadProfile;
