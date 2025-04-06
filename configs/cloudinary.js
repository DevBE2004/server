const { v2 } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: v2,
  params: {
    folder: "app",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

const upload = multer({ storage: storage });

module.exports = { upload, v2 };
