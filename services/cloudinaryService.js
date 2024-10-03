const cloudinary = require('cloudinary').v2;
const path = require('path');

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dhd2t66jk",
  api_key: "321497329633571",
  api_secret: "cl18Lfr5620YRbacTXJY-FjhwLk"
});

// Upload image to Cloudinary
const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath); // Directly use filePath
    return result.secure_url; // Return the secure URL of the uploaded image
  } catch (error) {
    throw new Error('Image upload failed: ' + error.message); // Improved error message
  }
};

// Create a video slideshow from image URLs
const createVideoFromImages = async (imageUrls) => {
  try {
    // Use Cloudinary's video creation capabilities from images
    const video = cloudinary.video(imageUrls.join('|'), {
      resource_type: 'video',  // Ensure the resource type is set to 'video'
      transformation: [
        { width: 640, height: 480, crop: 'fit' },  // Adjust the size of each image in the video
        { duration: 5 },  // Each image will be displayed for 5 seconds
      ],
      flags: "animated" // Ensures a video/slideshow is created from images
    });
    return video; // Return the URL of the created video
  } catch (error) {
    throw new Error('Video creation failed: ' + error.message); // Improved error message
  }
};

module.exports = { uploadImage, createVideoFromImages };
