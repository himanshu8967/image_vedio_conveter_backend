const express = require('express');
const multer = require('multer');
const { uploadImageHandler } = require('../controllers/imageController');
const { createSlideshowHandler } = require('../controllers/videoController');

const router = express.Router();

// Multer setup to handle file uploads (store in 'uploads/' folder)
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5 MB
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files (optional)
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Image upload route
router.post('/upload', upload.single('image'), (req, res, next) => {
  // Use `next` to pass any multer errors to the error handler
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  next();
}, uploadImageHandler);

// Video slideshow creation route
router.post('/create-slideshow', createSlideshowHandler);

module.exports = router;
