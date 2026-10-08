// Firebase Client SDK Configuration for CampusPulse Frontend
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Web App Configuration loaded from Vite environment variables (.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// Check if actual credentials have been populated (not empty or default placeholders)
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('YOUR_')
);

let app = null;
let auth = null;
let db = null;
let storage = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Initialize Google Authentication Provider
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    console.log('🔥 Firebase Client initialized with Google Auth for project:', firebaseConfig.projectId);
  } catch (error) {
    console.warn('⚠️ Firebase Client initialization warning:', error.message);
  }
} else {
  console.info('ℹ️ Firebase environment variables not set or using placeholders. App running in offline/API mode.');
}

export { app, auth, db, storage, googleProvider, signInWithPopup, signOut, firebaseConfig };
