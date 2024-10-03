const express = require('express');
const multer = require('multer');
const { uploadImageHandler } = require('../controllers/imageController');
const { createSlideshowHandler } = require('../controllers/videoController');

const router = express.Router();

// Multer setup to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Image upload route
// router.post('/upload', upload.single('image'), uploadImageHandler);
router.post('/upload', upload.single('image',), uploadImageHandler);



// Video slideshow creation route
router.post('/create-slideshow', createSlideshowHandler);

module.exports = router;
