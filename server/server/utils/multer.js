const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directories if they don't exist
const createUploadsDirectories = () => {
  const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'events');
  const profileDir = path.join(__dirname, '..', 'public', 'uploads', 'profiles');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
  }
  
  return { uploadDir, profileDir };
};

// Create directories on startup
const { uploadDir, profileDir } = createUploadsDirectories();

// Configure storage for files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination based on field name
    if (file.fieldname === 'profile_image') {
      cb(null, profileDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const prefix = file.fieldname === 'profile_image' ? 'profile' : 'file';
    cb(null, `${prefix}-${uniqueSuffix}${fileExtension}`);
  }
});

// Allow all file types
const fileFilter = (req, file, cb) => {
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
