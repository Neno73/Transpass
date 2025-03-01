import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  connectFirestoreEmulator, 
  doc, 
  updateDoc, 
  setDoc,
  getDoc,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration with fallback values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBJ_036GDtfufZG4WUSjw6wa3lDhaKFb5g",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "q-project-97c6f.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "q-project-97c6f",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "q-project-97c6f.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1047562197624",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1047562197624:web:516b930ead757f4b7deb8d",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-T84C9N4EG2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firestore with improved offline/online capabilities
// Note: We're switching to standard initialization to handle offline errors
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalAutoDetectLongPolling: true,
  ignoreUndefinedProperties: true
});

// Connect to Firestore emulator if in development environment
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log('Firestore persistence enabled successfully');
    })
    .catch((err) => {
      console.warn('Failed to enable Firestore persistence:', err.code, err.message);
      
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn('Multiple tabs open, persistence only enabled in one tab');
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all features required for persistence
        console.warn('This browser does not support IndexedDB persistence');
      }
    });
}

const storage = getStorage(app);

// Initialize Analytics (only on client side)
let analytics = null;

if (typeof window !== 'undefined') {
  // Check if analytics is supported in the current environment
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Implement enhanced retry mechanism with network detection for V9 Firestore API
export const connectWithRetry = async (maxRetries = 5, initialDelay = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // First check online status
      if (typeof window !== 'undefined' && !window.navigator.onLine) {
        console.warn(`Browser reports offline status, waiting before attempt ${attempt}`);
        // Wait a bit shorter before checking again if we're offline
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue; // Skip to next iteration without counting as a failure
      }
      
      console.log(`Firestore connection attempt ${attempt}/${maxRetries}`);
      
      // Try a simple operation using V9 Firestore API
      const testRef = doc(db, '_connectivity_test', 'test');
      
      // First try to get the document to minimize writes
      try {
        const docSnap = await getDoc(testRef);
        if (docSnap.exists()) {
          // If document exists, update timestamp
          await updateDoc(testRef, {
            timestamp: Date.now(),
            attemptCount: (docSnap.data().attemptCount || 0) + 1
          });
        } else {
          // If document doesn't exist, create it
          await setDoc(testRef, {
            timestamp: Date.now(),
            attemptCount: 1,
            createdAt: Date.now()
          });
        }
      } catch (docError) {
        // If getting the document failed, try to create it
        await setDoc(testRef, {
          timestamp: Date.now(),
          attemptCount: 1,
          createdAt: Date.now()
        });
      }
      
      console.log('Connected to Firestore successfully');
      return true;
    } catch (error: any) {
      // Log detailed error information
      console.log(`Connection attempt ${attempt} failed: ${error.message || error}`);
      console.log(`Error code: ${error.code}, name: ${error.name}`);
      
      if (attempt === maxRetries) {
        console.error('Max retries reached. Firestore connection failed.');
        // Provide more detailed diagnostics
        if (error.code === 'failed-precondition' || error.message.includes('offline')) {
          console.error('Network appears to be offline or unreliable');
        } else if (error.code === 'permission-denied') {
          console.error('Firebase security rules may be blocking access');
        } else if (error.code === 'not-found') {
          console.error('Firestore database may not exist in the project yet');
        }
        return false;
      }
      
      // Exponential backoff with a reasonable cap
      const delayMs = Math.min(initialDelay * Math.pow(1.5, attempt-1), 10000);
      console.log(`Waiting ${delayMs/1000} seconds before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return false;
};

export { auth, db, storage, analytics };