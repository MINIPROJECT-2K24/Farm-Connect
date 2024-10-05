import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

// Initialize Firebase Admin SDK if it's not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert("./config/serviceAccountKey.json"), // Path to service account key file
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Firebase Storage bucket URL from .env file
  });
}

// Export the storage bucket
const bucket = admin.storage().bucket();
export { bucket };
