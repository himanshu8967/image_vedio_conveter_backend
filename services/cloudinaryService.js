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
// const createVideoFromImages = async (imageUrls) => {
//   try {
//     // Use Cloudinary's video creation capabilities from images
//     const video = cloudinary.video(imageUrls.join('|'), {
//       resource_type: 'video',  // Ensure the resource type is set to 'video'
//       transformation: [
//         { width: 640, height: 480, crop: 'fit' },  // Adjust the size of each image in the video
//         { duration: 5 },  // Each image will be displayed for 5 seconds
//       ],
//       flags: "animated" // Ensures a video/slideshow is created from images
//     });
//     return video; // Return the URL of the created video
//   } catch (error) {
//     throw new Error('Video creation failed: ' + error.message); // Improved error message
//   }
// };



const checkVideoStatus = async (public_id) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const result = await cloudinary.api.resource(public_id, { resource_type: 'video' });
        if (result && result.secure_url) {
          clearInterval(interval);
          resolve(result.secure_url);  // Video is ready, resolve with the secure URL
        }
      } catch (error) {
        clearInterval(interval);
        reject('Error fetching video status: ' + error.message);
      }
    }, 5000); // Poll every 5 seconds
  });
};

const createVideoFromImages = async (imageUrls, public_id) => {
  try {
    const mappedImageUrls = imageUrls.map(url => {
      // const publicId = url.split('/').slice(-2).join('/').split('.')[0]; // Extract public_id from URL
      // return { media: `i:${publicId}` };
      const publicId = url.split('/').slice(-1)[0].split('.')[0]; // Extract public_id from URL
      return { media: `i:${publicId}` };
    });

    console.log(mappedImageUrls);


    const manifest = {
      "w": 500,
      "h": 500,
      "du": 4*mappedImageUrls.length,  // Total video duration (seconds)
      "vars": {
        "sdur": 3000,  // Duration of each slide (milliseconds)
        "tdur": 1000,  // Transition duration between slides (milliseconds)
        "slides": mappedImageUrls
      }
    }

    
    // Use Cloudinary's create_slideshow API
    const result = await cloudinary.uploader.create_slideshow({
      manifest_json: JSON.stringify(manifest),
      public_id: public_id
    });

    console.log(public_id);

    const secureUrl = await checkVideoStatus(result.public_id);
    console.log(secureUrl);
    // return secureUrl;

    // console.log(result);
    return secureUrl; // Return the result of the slideshow creation
  } catch (error) {
    console.error('Error creating slideshow:', error);
    throw new Error('Error creating slideshow: ' + error.message);
  }
};

// Example usage



module.exports = { uploadImage, createVideoFromImages };
