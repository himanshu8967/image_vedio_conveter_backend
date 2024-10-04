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

const createVideoFromImages = async (imagePublicIds) => {
  try {
    const manifest = {
      "w": 500,
      "h": 500,
      "du": 20,  // Total duration in seconds
      "fps": 30, // Frames per second
      "tracks": [
        {
          "width": 500,
          "height": 500,
          "x": 0,
          "y": 0,
          "clipDefaults": {
            "clipDuration": 3000, // Duration of each clip in milliseconds
            "transitionDuration": 1000, // Duration of transition in milliseconds
            "transition": "fade" // You can use different transitions like circlecrop, slide, fade, etc.
          },
          "clips": imagePublicIds.map(publicId => ({
            "media": publicId,
            "type": "image",
            "transformation": "c_fill"
          }))
        }
      ]
    };

    // Use Cloudinary's create_slideshow API
    const result = await cloudinary.uploader.create_slideshow({
      manifest_json: JSON.stringify(manifest),
      public_id: 'sanjiv_testing1'
    });

    const secureUrl = await checkVideoStatus(result.public_id);
    console.log('Video ready:', secureUrl);
    return secureUrl;

    // console.log(result);
    // return result.secure_url; // Return the result of the slideshow creation
  } catch (error) {
    console.error('Error creating slideshow:', error);
    throw new Error('Error creating slideshow: ' + error.message);
  }
};

// Example usage
const imagePublicIds = [
  "https://res.cloudinary.com/dhd2t66jk/image/upload/v1728010599/yqmcaw1sujt035yazoxs.jpg",  // Replace with your image's public_id
  "https://res.cloudinary.com/dhd2t66jk/image/upload/v1728010645/kkdfxu0mxptimri3rdwi.jpg"   // Replace with your image's public_id
];

createVideoFromImages(imagePublicIds)
  .then((videoUrl) => {
    console.log('Generated video:', videoUrl);
  })
  .catch((error) => {
    console.error('Error creating video slideshow:', error);
  });


module.exports = { uploadImage, createVideoFromImages };
