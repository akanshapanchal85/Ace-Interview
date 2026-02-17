// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// NOTE: In Next.js, NEXT_PUBLIC_* env vars are inlined at build time only for
// literal accesses like `process.env.NEXT_PUBLIC_FOO`. Don't use `process.env[k]`.
const missing = [
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY && "NEXT_PUBLIC_FIREBASE_API_KEY",
  !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  !process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  !process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  !process.env.NEXT_PUBLIC_FIREBASE_APP_ID && "NEXT_PUBLIC_FIREBASE_APP_ID",
].filter(Boolean) as string[];
if (missing.length) {
  throw new Error(
    `Missing Firebase client env vars: ${missing.join(
      ", "
    )}. Add them to .env.local and restart the dev server.`
  );
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);