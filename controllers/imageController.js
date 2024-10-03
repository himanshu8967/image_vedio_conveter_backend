const { uploadImage } = require('../services/cloudinaryService');
const fs = require('fs'); // For managing local files if needed (optional)
const path = require('path');

// Upload image handler
const uploadImageHandler = async (req, res) => {
  try {
    // Ensure the file exists
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Get the file path from the uploaded file
    const filePath = path.resolve(req.file.path); // Use path.resolve to handle cross-platform paths

    // Upload the image to Cloudinary
    const imageUrl = await uploadImage(filePath);

    // Optional: Delete the local file after uploading to Cloudinary
    fs.unlinkSync(filePath); // Removes the file from local storage after Cloudinary upload

    // Send response with uploaded image URL
    return res.status(200).json({ success: true, url: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error); // Log the error for debugging
    return res.status(500).json({ success: false, message: 'Image upload failed: ' + error.message });
  }
};

module.exports = { uploadImageHandler };
