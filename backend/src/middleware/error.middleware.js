import multer from "multer";

// ─── Global Error Handler ─────────────────────────────────────────
// Must have 4 parameters for Express to recognize it as an error handler
export const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err.stack);

  const statusCode = err.statusCode || 500;
  const message = statusCode < 500 ? err.message : "Internal server error";

  res.status(statusCode).json({ message });
};

// multer error
export const multerError = (uploadInstance) => (req, res, next) => {
  uploadInstance.single("resume")(req, res, (err) => {
    if (err instanceof multer.MulterError)
      // LIMIT_FILE_SIZE
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    if (err) return res.status(400).json({ message: err.message }); // ONLY PDF, DOC, DOCX files are accepted

    next();
  });
};
