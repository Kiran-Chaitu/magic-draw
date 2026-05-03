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

  // 🔥 Detect file type (optional but useful)
  const isVideo = file.mimetype.startsWith("video/");
  const isImage = file.mimetype.startsWith("image/");
  const isPDF = file.mimetype === "application/pdf";

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "drawings",

        // 🔥 auto handles image + pdf + video
        resource_type: "auto",

        // 🔥 better unique naming
        public_id: `file_${Date.now()}`,

        // 🔥 optional optimizations
        ...(isImage && { quality: "auto", fetch_format: "auto" }),

        // 🔥 optional: better handling for videos
        ...(isVideo && { chunk_size: 6000000 }), // 6MB chunks
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
      format: result.format,
      bytes: result.bytes,
    },
  });
});