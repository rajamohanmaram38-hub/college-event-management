import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Ensure uploads folder exists in server directory
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * POST /api/upload/image
 * Handles image data uploads (base64) and saves to server static folder
 */
router.post('/image', (req, res, next) => {
  try {
    const { base64Data, filename = 'image', folder = 'posters' } = req.body;

    if (!base64Data) {
      return res.status(400).json({
        success: false,
        message: 'No image data provided in upload payload.'
      });
    }

    // Extract format and data
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    let ext = 'jpg';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      ext = mime.split('/')[1]?.replace('jpeg', 'jpg') || 'png';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      // Direct raw base64 string
      buffer = Buffer.from(base64Data, 'base64');
    }

    // Limit check: 10MB
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Uploaded file exceeds 10MB limit.'
      });
    }

    // Generate clean safe file name
    const rawClean = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFilename = `${Date.now()}_${rawClean}.${ext}`;
    const targetFilePath = path.join(UPLOADS_DIR, safeFilename);

    // Save to disk
    fs.writeFileSync(targetFilePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;

    console.log(`📸 Image stored locally: ${safeFilename} (${(buffer.length / 1024).toFixed(1)} KB)`);

    return res.status(201).json({
      success: true,
      url: publicUrl,
      filename: safeFilename,
      sizeBytes: buffer.length
    });
  } catch (err) {
    next(err);
  }
});

export default router;
