import multer from "multer";
import { upload } from "./upload.middleware.js";

// ─── Global Error Handler ─────────────────────────────────────────
// Must have 4 parameters for Express to recognize it as an error handler
export const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err.stack);

  const statusCode = err.statusCode || 500;
  const message = statusCode < 500 ? err.message : "Internal server error";

  res.status(statusCode).json({ message });
};

// multer error
export const multerError = (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (err instanceof multer.MulterError)
      // LIMIT_FILE_SIZE
      res.status(400).json({ message: `Upload error: ${err.message}` });
    else if (err) res.status(400).json({ message: err.message }); // ONLY PDF, DOC, DOCX files are accepted

    next();
  });
};
