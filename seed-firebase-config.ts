import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

type AppletConfig = {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
};

function readAppletConfig(): AppletConfig {
  try {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const configPath = resolve(currentDir, 'firebase-applet-config.json');
    return JSON.parse(readFileSync(configPath, 'utf8')) as AppletConfig;
  } catch {
    return {};
  }
}

export function getSeedFirebaseConfig(): FirebaseOptions {
  const fileConfig = readAppletConfig();

  return {
    apiKey: process.env.FIREBASE_API_KEY || fileConfig.apiKey,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || fileConfig.authDomain,
    projectId: process.env.FIREBASE_PROJECT_ID || fileConfig.projectId || 'kennyboa-b3902',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || fileConfig.storageBucket,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || fileConfig.messagingSenderId,
    appId: process.env.FIREBASE_APP_ID || fileConfig.appId,
  };
}

export async function signInSeedAdmin(firebaseApp: FirebaseApp) {
  const email = process.env.FIREBASE_ADMIN_EMAIL;
  const password = process.env.FIREBASE_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('No FIREBASE_ADMIN_EMAIL/FIREBASE_ADMIN_PASSWORD set; attempting writes without Firebase Auth.');
    return;
  }

  const credential = await signInWithEmailAndPassword(getAuth(firebaseApp), email, password);
  console.log(`Signed in to Firebase Auth as ${credential.user.email || email}.`);
}

export function explainSeedPermissionError(error: unknown) {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: unknown }).code)
    : '';

  if (code !== 'permission-denied') return;

  console.error('');
  console.error('Firestore denied the write.');
  console.error('These seed scripts use the Firebase Client SDK, so Firestore security rules still apply.');
  console.error('Set FIREBASE_ADMIN_EMAIL and FIREBASE_ADMIN_PASSWORD for a Firebase Auth user allowed by isAdmin(),');
  console.error('or temporarily allow writes in Firestore rules, run the seed, then restore the safer rules.');
}
