// Firebase Admin SDK Configuration for CampusPulse Backend
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let adminApp = null;
let adminAuth = null;
let adminDb = null;
let adminStorage = null;
let isFirebaseAdminConfigured = false;

try {
  // Method 1: Check for serviceAccountKey.json file
  const keyPathEnv = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const defaultKeyPath = path.join(__dirname, '../../serviceAccountKey.json');
  const targetKeyPath = keyPathEnv ? path.resolve(__dirname, '../../', keyPathEnv) : defaultKeyPath;

  if (fs.existsSync(targetKeyPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(targetKeyPath, 'utf8'));
    adminApp = !getApps().length
      ? initializeApp({
          credential: cert(serviceAccount),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`
        })
      : getApp();
    isFirebaseAdminConfigured = true;
    console.log('🔥 Firebase Admin initialized via serviceAccountKey.json for project:', serviceAccount.project_id);
  }
  // Method 2: Check for individual environment variables
  else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    adminApp = !getApps().length
      ? initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey
          }),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
        })
      : getApp();
    isFirebaseAdminConfigured = true;
    console.log('🔥 Firebase Admin initialized via env variables for project:', process.env.FIREBASE_PROJECT_ID);
  } else {
    console.info('ℹ️ Firebase Admin credentials not detected. Backend continuing with SQLite database.');
  }

  if (isFirebaseAdminConfigured && adminApp) {
    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
    adminStorage = getStorage(adminApp);
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin initialization notice:', error.message);
  isFirebaseAdminConfigured = false;
}

export { adminApp, adminAuth, adminDb, adminStorage, isFirebaseAdminConfigured };
