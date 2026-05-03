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
  const isPDF = file.mimetype === "application/pdf";

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "drawings",
        resource_type: "auto",
        public_id: `file_${Date.now()}`,

        ...(isImage && { quality: "auto", fetch_format: "auto" }),
        ...(isVideo && { chunk_size: 6000000 }),
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(file.buffer);
  });

  // 🔥 FIX: Correct URL handling
  let fileUrl = result.secure_url;

  // ✅ Fix for PDF (VERY IMPORTANT)
  if (result.format === "pdf") {
    fileUrl = fileUrl.replace("/image/upload/", "/raw/upload/");
  }

  // ✅ Fix for videos (ensure proper delivery path)
  if (result.resource_type === "video") {
    fileUrl = fileUrl.replace("/image/upload/", "/video/upload/");
  }

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