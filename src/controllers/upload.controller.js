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

  const isVideo = file.mimetype.startsWith("video/");
  const isImage = file.mimetype.startsWith("image/");

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "drawings",
        resource_type: "auto",
        public_id: `file_${Date.now()}`,

        // 🔥 Image optimization
        ...(isImage && { quality: "auto", fetch_format: "auto" }),

        // 🔥 Video handling
        ...(isVideo && { chunk_size: 6000000 }),
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(file.buffer);
  });


  const fileUrl = result.secure_url;

  return res.status(200).json({
    success: true,
    message: "File uploaded successfully",
    data: {
      url: fileUrl,
      public_id: result.public_id,
      type: result.resource_type,
      format: result.format,
      bytes: result.bytes,
    },
  });
});