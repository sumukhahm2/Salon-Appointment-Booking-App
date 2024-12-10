const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const multer = require('multer');

dotenv.config({ path: `.env.local`, override: true });

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory before uploading to S3
});

// Helper function to determine file extension
function getFileExtension(mimeType) {
  const mimeToExt = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'application/json': '.json',
    'video/mp4': '.mp4',
  };
  return mimeToExt[mimeType] || ''; // Return empty string if mimetype is not recognized
}

// Function to upload a file to S3
 const upLoadToS3=async(data, fileName, contentType)=>{
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  const s3Bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

   const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: data, 
    ContentType: contentType,
    ACL: 'public-read',
    ContentDisposition: 'inline', 
  };

  return new Promise((resolve, reject) => {
    s3Bucket.upload(params, (err, s3Response) => {
      if (err) {
        console.error("Error uploading to S3:", err);
        reject(err);
      } else {
        console.log("S3 Response:", s3Response);
        resolve({ location: s3Response.Location, mimeType: contentType });
      }
    });
  });
}

// Middleware to process and upload file
const addDocuments = async (req, res, next) => {
  try {
    const file = req.file; // Get the uploaded file
    const body = req.body; // Get additional form fields

    console.log("Uploaded File:", file);
    console.log("Form Data:", body);

    if (file) {
      // Prepare file for S3 upload
      const contentType = file.mimetype; // File mimetype
      const fileName = `salonbooking_${Date.now()}_${file.originalname}`; // Unique file name
      const buffer = file.buffer; // File buffer from multer

      // Upload file to S3
      const url = await upLoadToS3(buffer, fileName, contentType);
      console.log("Uploaded File URL:", url);

      if (url) {
        // Prepare profile data
        const profileData = {
          name: body.name || null,
          address: body.address || null,
          dob: body.dob || null,
          gender: body.gender || null,
          photo: url.location, // S3 URL
        };

        req.data = profileData; // Pass data to the next middleware
        return next();
      }
    } else {
      // No file provided, handle as a normal form submission
      const profileData = {
        name: body.name || null,
        address: body.address || null,
        dob: body.dob || null,
        gender: body.gender || null,
        photo: null, // No file uploaded
      };

      req.data = profileData; // Pass data to the next middleware
      return next();
    }
  } catch (error) {
    console.error("Error in addDocuments:", error);
    res.status(500).json({ message: "Error processing upload", error });
  }
};

module.exports = {
  addDocuments: [upload.single('photo'), addDocuments], 
  upLoadToS3// Use multer for single file upload
};
