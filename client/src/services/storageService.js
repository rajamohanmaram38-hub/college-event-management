// Firebase Cloud Storage Service for CampusPulse
// Handles file uploads, progress tracking, URL retrieval, and resilient fallbacks

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from '../config/firebase';

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml'
];

/**
 * Upload an event poster/banner image to Firebase Cloud Storage with real-time progress
 * @param {File} file - Browser File object
 * @param {Function} onProgress - Callback receiving (progressPercent: number)
 * @returns {Promise<{ url: string, provider: 'firebase-storage' | 'server-uploads' | 'data-url', fileName: string }>}
 */
export async function uploadEventPoster(file, onProgress = () => {}) {
  return uploadFile(file, 'events/posters', onProgress);
}

/**
 * Upload a student profile avatar
 * @param {File} file - Browser File object
 * @param {string} studentId - Unique student identifier
 * @param {Function} onProgress - Callback receiving (progressPercent: number)
 * @returns {Promise<{ url: string, provider: string, fileName: string }>}
 */
export async function uploadStudentAvatar(file, studentId = 'anon', onProgress = () => {}) {
  const customPrefix = `students/avatars/${studentId}`;
  return uploadFile(file, customPrefix, onProgress);
}

/**
 * Generic file uploader with Firebase Cloud Storage + Resilient Server Fallback
 */
export async function uploadFile(file, folder = 'uploads', onProgress = () => {}) {
  if (!file) {
    throw new Error('Please select an image file to upload.');
  }

  // Type validation
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Unsupported format. Please select a JPG, PNG, WebP, GIF, or SVG image.');
  }

  // Size validation
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed size is 8MB.`);
  }

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${folder}/${Date.now()}_${cleanFileName}`;

  // 1. Primary Strategy: Direct Firebase Cloud Storage Upload
  if (isFirebaseConfigured && storage) {
    try {
      console.log(`☁️ Initiating Firebase Cloud Storage upload to: ${storagePath}`);
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type
      });

      const downloadUrl = await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            if (snapshot.totalBytes > 0) {
              const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              onProgress(percent);
            }
          },
          (error) => {
            console.warn('Firebase Cloud Storage direct upload error:', error.code, error.message);
            reject(error);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (err) {
              reject(err);
            }
          }
        );
      });

      console.log('✅ Firebase Cloud Storage upload succeeded:', downloadUrl);
      return {
        url: downloadUrl,
        provider: 'firebase-storage',
        path: storagePath,
        fileName: file.name
      };
    } catch (fbError) {
      console.warn(
        '⚠️ Firebase Storage direct upload failed or bucket is unprovisioned. Falling back to local media engine...',
        fbError?.message
      );
    }
  }

  // 2. Secondary Strategy: Upload via Server Media API (/api/upload/image)
  try {
    onProgress(35);
    const base64Data = await readFileAsDataURL(file);
    onProgress(65);

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        base64Data,
        filename: file.name,
        folder
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.url) {
        onProgress(100);
        console.log('✅ Saved via Server Media Engine:', data.url);
        return {
          url: data.url,
          provider: 'server-uploads',
          path: data.filename,
          fileName: file.name
        };
      }
    }
  } catch (serverErr) {
    console.warn('Server upload fallback failed, using data URL preview:', serverErr.message);
  }

  // 3. Ultimate Fallback: Instant Base64 Data URL (guarantees preview & persistence)
  onProgress(90);
  const localUrl = await readFileAsDataURL(file);
  onProgress(100);
  return {
    url: localUrl,
    provider: 'data-url',
    path: storagePath,
    fileName: file.name
  };
}

/**
 * Helper to convert File to Data URL string
 */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(new Error('Failed to read image file locally.'));
    reader.readAsDataURL(file);
  });
}
