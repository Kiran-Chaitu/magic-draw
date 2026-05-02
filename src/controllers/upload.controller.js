import cloudinary from "../config/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const file = req.file;

  const isPDF = file.mimetype === "application/pdf";

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "drawings",
        resource_type: isPDF ? "raw" : "image",
        public_id: `file_${Date.now()}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(file.buffer);
  });

  return res.status(200).json({
    success: true,
    message: "File uploaded successfully",
    data: {
      url: result.secure_url,
      public_id: result.public_id,
      type: result.resource_type,
    },
  });
});