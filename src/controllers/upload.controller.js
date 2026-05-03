export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "drawings",
        resource_type: "auto", // 🔥 key line
        public_id: `file_${Date.now()}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(req.file.buffer);
  });

  return res.status(200).json({
    success: true,
    data: {
      url: result.secure_url,
      type: result.resource_type, // 👈 useful for frontend
    },
  });
});