import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
const configs = import.meta.glob('../*.json', { eager: true });
const fallbackConfig = (configs['../firebase-applet-config.json'] as any)?.default || {};

// Support safe loading from Environment Variables first, falls back to JSON, then to hardcoded defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey || "AIzaSyBIx2ZUZHuB4XiMUGGEd978kXqHvMQi3Hc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain || "suutresort-b086e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId || "suutresort-b086e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket || "suutresort-b086e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId || "927433276278",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId || "1:927433276278:web:27dec30ca02d8bea451857",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || fallbackConfig.measurementId || "",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || (fallbackConfig as any).firestoreDatabaseId || "ai-studio-a2e22e09-6df5-4d9a-a9e9-42e322607bb8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId || '(default)');

export default app;
