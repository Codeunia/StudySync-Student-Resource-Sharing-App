// backend/routes/upload.js
import express from 'express';
import { upload } from '../middleware/multer.js'; // We will create this middleware next
import { ensureAuth } from '../middleware/auth.js';

const router = express.Router();

// @desc    Upload a file to Cloudinary
// @route   POST /api/upload
router.post('/', ensureAuth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  // Multer and Cloudinary have done their job. The file info is in req.file.
  res.status(201).json({
    message: 'File uploaded successfully!',
    url: req.file.path, // The URL of the uploaded file
    cloudinaryId: req.file.filename, // The public ID of the file
  });
});

export default router;