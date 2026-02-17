import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function readRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function normalizePrivateKey(raw: string): string {
  // Handle keys pasted with quotes and escaped newlines.
  const trimmed = raw.trim();
  const unquoted = trimmed.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  const withNewlines = unquoted.replace(/\\n/g, "\n").replace(/\\r/g, "\r");

  if (
    !withNewlines.includes("-----BEGIN PRIVATE KEY-----") ||
    !withNewlines.includes("-----END PRIVATE KEY-----")
  ) {
    throw new Error(
      "Invalid FIREBASE_PRIVATE_KEY: missing BEGIN/END markers. " +
        "Paste the full `private_key` from your Firebase service account JSON, " +
        "including the END line."
    );
  }

  return withNewlines;
}

export const initializeAdmin = () => {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: readRequiredEnv("FIREBASE_PROJECT_ID"),
        clientEmail: readRequiredEnv("FIREBASE_CLIENT_EMAIL"),
        privateKey: normalizePrivateKey(readRequiredEnv("FIREBASE_PRIVATE_KEY")),
      }),
    });
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
};

export const { auth, db } = initializeAdmin();

export default initializeAdmin;