// Script to seed Cloud Firestore collections with initial college event data
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Firebase Admin directly from server config
import { adminDb, isFirebaseAdminConfigured } from '../server/src/config/firebaseAdmin.js';
import { queryAll } from './dbConnection.js';

async function seedFirestore() {
  console.log('🔥 Initializing Cloud Firestore Seeder...');

  if (!isFirebaseAdminConfigured || !adminDb) {
    console.error('❌ Firebase Admin is not configured.');
    console.error('👉 Ensure server/serviceAccountKey.json is present.');
    process.exit(1);
  }

  try {
    // 1. Fetch data from SQLite database
    const events = queryAll('SELECT * FROM events');
    const students = queryAll('SELECT * FROM students');
    const admins = queryAll('SELECT * FROM admins');
    const registrations = queryAll('SELECT * FROM registrations');

    console.log(`📦 Found ${events.length} events, ${students.length} students, ${admins.length} admins, ${registrations.length} registrations to upload.`);

    // 2. Batch write to Firestore
    const batch = adminDb.batch();

    // Upload events
    events.forEach(evt => {
      let agenda = [];
      try {
        agenda = typeof evt.agenda === 'string' ? JSON.parse(evt.agenda) : (evt.agenda || []);
      } catch {
        agenda = [];
      }
      const docRef = adminDb.collection('events').doc(evt.id);
      batch.set(docRef, {
        ...evt,
        featured: Boolean(evt.featured),
        agenda,
        updatedAt: new Date().toISOString()
      });
    });

    // Upload students
    students.forEach(stu => {
      const docRef = adminDb.collection('students').doc(stu.id);
      batch.set(docRef, { ...stu, role: 'student' });
    });

    // Upload admins
    admins.forEach(adm => {
      const docRef = adminDb.collection('admins').doc(adm.id);
      batch.set(docRef, { ...adm, role: 'admin' });
    });

    // Upload registrations
    registrations.forEach(reg => {
      const docRef = adminDb.collection('registrations').doc(reg.id);
      batch.set(docRef, reg);
    });

    console.log('🚀 Committing batch to Cloud Firestore...');
    await batch.commit();
    console.log('🎉 Successfully populated Cloud Firestore with initial sample data!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error.message || error);
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
      console.log('\n💡 Tip: Make sure Cloud Firestore Database has been created in your Firebase Console:');
      console.log('👉 https://console.firebase.google.com/project/college-event-management-d2187/firestore');
    }
    process.exit(1);
  }
}

seedFirestore();
