import multer from "multer";

// Store in memory (best for direct upload to cloud)
const storage = multer.memoryStorage();

// File filter (only image + pdf)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
  "video/mp4",
  "video/quicktime", // .mov
  "video/x-matroska", // .mkv (optional)
];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images, pdfs and videos are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export default upload;