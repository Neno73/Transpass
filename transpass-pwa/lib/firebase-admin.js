/**
 * Firebase Admin SDK initialization
 * 
 * This module provides server-side Firebase access with Admin SDK privileges.
 * Use this for administrative tasks, background jobs, and server API routes.
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let serviceAccount;

// Get service account from environment variables or JSON file
try {
  // First check for environment variable (deployment environment)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log('Using Firebase service account from environment variable');
  } else {
    // Fall back to local JSON file (development environment)
    const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');
    
    if (fs.existsSync(serviceAccountPath)) {
      serviceAccount = require(serviceAccountPath);
      console.log('Using Firebase service account from local JSON file');
    } else {
      throw new Error('Firebase service account file not found');
    }
  }
} catch (error) {
  console.error('Error loading Firebase service account:', error);
  process.exit(1);
}

// Initialize Firebase Admin SDK if not already initialized
let firebaseAdmin;

if (!admin.apps.length) {
  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('Firebase Admin SDK initialized');
} else {
  firebaseAdmin = admin.app();
  console.log('Using existing Firebase Admin SDK instance');
}

// Get Firestore instance with default settings
const db = admin.firestore();

// Get Auth instance
const auth = admin.auth();

// Get Storage instance
const storage = admin.storage();

// Retry mechanism for database operations
const connectWithRetry = async (maxRetries = 5, initialDelay = 5000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Try a simple operation
      const testRef = db.collection('_connectivity_test').doc('test');
      await testRef.set({timestamp: new Date().toISOString()});
      console.log('Connected to Firestore successfully with Admin SDK');
      return true;
    } catch (error) {
      console.log(`Connection attempt ${attempt} failed: ${error.message}`);
      
      if (attempt === maxRetries) {
        console.error('Max retries reached. Database may still be propagating or does not exist.');
        return false;
      }
      
      // Exponential backoff
      const delayMs = initialDelay * Math.pow(2, attempt-1);
      console.log(`Waiting ${delayMs/1000} seconds before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
};

// Verify the database exists and is accessible
const verifyDatabaseConnection = async () => {
  try {
    return await connectWithRetry();
  } catch (error) {
    console.error('Failed to verify database connection:', error);
    return false;
  }
};

module.exports = {
  admin,
  firebaseAdmin,
  db,
  auth,
  storage,
  verifyDatabaseConnection,
  connectWithRetry
};