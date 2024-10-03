const { createVideoFromImages } = require('../services/cloudinaryService');

// Create video slideshow handler
const createSlideshowHandler = async (req, res) => {
  const { imageUrls } = req.body;
  console.log(imageUrls)
  // Validate imageUrls input
  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input: Please provide a non-empty array of image URLs.',
    });
  }

  try {
    // Generate video from image URLs
    const videoUrl = await createVideoFromImages(imageUrls);
    
    // Return the generated video URL
    return res.status(200).json({ success: true, videoUrl });
  } catch (error) {
    // Log the error for debugging
    console.error('Error creating video slideshow:', error);

    // Send error response
    return res.status(500).json({
      success: false,
      message: 'Video creation failed: ' + error.message,
    });
  }
};

module.exports = { createSlideshowHandler };
