/**
 * Firestore Database Connection Verification Script
 * 
 * This script attempts to connect to Firestore with the new configuration
 * featuring explicit region endpoint and retry mechanism.
 */

const { initializeApp } = require('firebase/app');
const { 
  initializeFirestore, 
  collection, 
  addDoc, 
  getDoc, 
  doc, 
  deleteDoc, 
  CACHE_SIZE_UNLIMITED 
} = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ_036GDtfufZG4WUSjw6wa3lDhaKFb5g",
  authDomain: "q-project-97c6f.firebaseapp.com",
  projectId: "q-project-97c6f",
  storageBucket: "q-project-97c6f.firebasestorage.app",
  messagingSenderId: "1047562197624",
  appId: "1:1047562197624:web:516b930ead757f4b7deb8d",
  measurementId: "G-T84C9N4EG2"
};

// Initialize Firebase
console.log("🔄 Initializing Firebase application...");
const app = initializeApp(firebaseConfig);

// Initialize Firestore with eur3 region explicitly configured
console.log("🔄 Initializing Firestore with explicit region endpoint...");
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true, // Use long polling instead of WebSockets
  host: "eur3-firestore.googleapis.com:443", // Explicit region endpoint
  ssl: true
});

// Retry mechanism for Firestore operations
const connectWithRetry = async (maxRetries = 5, initialDelay = 5000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Connection attempt ${attempt}/${maxRetries}...`);
      
      // Try to write a test document
      const testRef = collection(db, '_connectivity_test');
      const docRef = await addDoc(testRef, {
        timestamp: new Date().toISOString(),
        testId: `test-${Date.now()}`
      });
      
      console.log(`✅ Document written with ID: ${docRef.id}`);
      
      // Try to read the document back
      const docSnap = await getDoc(doc(db, '_connectivity_test', docRef.id));
      
      if (docSnap.exists()) {
        console.log(`✅ Document read successfully: ${JSON.stringify(docSnap.data())}`);
        
        // Clean up: delete the test document
        await deleteDoc(doc(db, '_connectivity_test', docRef.id));
        console.log(`✅ Document deleted successfully`);
        
        return true;
      } else {
        console.log(`❌ Document read failed: document does not exist`);
        return false;
      }
    } catch (error) {
      console.log(`❌ Connection attempt ${attempt} failed: ${error.message}`);
      
      if (attempt === maxRetries) {
        console.error('❌ Max retries reached. Firestore connection failed.');
        console.error('Possible causes:');
        console.error('1. Database may still be propagating through Google\'s infrastructure');
        console.error('2. Region endpoint might be incorrect');
        console.error('3. Firestore database might not exist in the project');
        console.error('4. Security rules might be blocking access');
        console.error('5. Network connectivity issues might be preventing connection');
        return false;
      }
      
      // Exponential backoff
      const delayMs = initialDelay * Math.pow(2, attempt-1);
      console.log(`⏳ Waiting ${delayMs/1000} seconds before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
};

// Run the verification
async function verifyFirestoreConnection() {
  console.log("🔄 Starting Firestore connection verification...");
  
  // Add a timeout for the entire process
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Connection verification timed out after 60 seconds"));
    }, 60000); // 60 second timeout
  });
  
  try {
    // Race between the connection verification and the timeout
    const result = await Promise.race([
      connectWithRetry(),
      timeoutPromise
    ]);
    
    if (result) {
      console.log("✅ SUCCESS: Firestore connection verified successfully");
      process.exit(0);
    } else {
      console.log("❌ FAILURE: Firestore connection verification failed");
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ ERROR: ${error.message}`);
    process.exit(1);
  }
}

// Execute verification
verifyFirestoreConnection();