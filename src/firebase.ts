import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
const configs = import.meta.glob('../*.json', { eager: true });
const fallbackConfig = (configs['../firebase-applet-config.json'] as any)?.default || {};

// Support safe loading from Environment Variables first, falls back to JSON
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || fallbackConfig.measurementId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || (fallbackConfig as any).firestoreDatabaseId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId || '(default)');

export default app;
