import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Potential paths for serviceAccountKey.json
const keyPaths = [
  path.join(__dirname, '../serviceAccountKey.json'),
  path.join(__dirname, './serviceAccountKey.json'),
  path.join(process.cwd(), 'server/serviceAccountKey.json'),
  path.join(process.cwd(), 'serviceAccountKey.json')
];

let serviceAccount = null;
for (const p of keyPaths) {
  if (fs.existsSync(p)) {
    try {
      const raw = fs.readFileSync(p, 'utf8');
      serviceAccount = JSON.parse(raw);
      console.log(`🔥 Loaded Firebase Service Account from ${p}`);
      break;
    } catch (e) {
      console.warn(`Could not parse service account file at ${p}:`, e.message);
    }
  }
}

let app;
let db;
let bucket;
let auth;
let isLiveFirestore = false;

if (serviceAccount && serviceAccount.project_id && serviceAccount.private_key && !serviceAccount.private_key.includes('YOUR_PRIVATE_KEY')) {
  try {
    const apps = getApps();
    if (apps.length === 0) {
      app = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: 'acet-3d.appspot.com'
      });
    } else {
      app = apps[0];
    }
    db = getFirestore(app);
    bucket = getStorage(app).bucket();
    auth = getAuth(app);
    isLiveFirestore = true;
    console.log('✅ Connected to live Google Cloud Firestore (Project: acet-3d)');
  } catch (err) {
    console.warn('⚠️ Firebase Admin initialization notice:', err.message);
  }
}

// Fallback initialization
if (!db) {
  try {
    const apps = getApps();
    if (apps.length === 0) {
      app = initializeApp({
        projectId: 'acet-3d',
        storageBucket: 'acet-3d.appspot.com'
      });
    } else {
      app = apps[0];
    }
    db = getFirestore(app);
    bucket = getStorage(app).bucket();
    auth = getAuth(app);
    isLiveFirestore = true;
  } catch (e) {
    console.log('ℹ️ Running in disk-backed Firestore fallback mode');
  }
}

// Admin compatibility wrapper
const admin = {
  app,
  firestore: () => db,
  storage: () => ({ bucket: () => bucket }),
  auth: () => auth,
  Timestamp,
  FieldValue
};

export { admin, db, bucket, auth, isLiveFirestore, Timestamp, FieldValue };
export default { admin, db, bucket, auth, isLiveFirestore };
