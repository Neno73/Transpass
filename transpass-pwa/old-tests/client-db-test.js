require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { 
  initializeFirestore, 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  deleteDoc,
  CACHE_SIZE_UNLIMITED 
} = require('firebase/firestore');

// Firebase configuration from environment variables or hardcoded fallback for testing
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBJ_036GDtfufZG4WUSjw6wa3lDhaKFb5g",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "q-project-97c6f.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "q-project-97c6f",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "q-project-97c6f.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1047562197624",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1047562197624:web:516b930ead757f4b7deb8d",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-T84C9N4EG2"
};

// Initialize Firebase client SDK
console.log("🔄 Initializing Firebase with config:", JSON.stringify(firebaseConfig, null, 2));
const app = initializeApp(firebaseConfig);

// Initialize Firestore with eur3 region explicitly configured
console.log("🔄 Initializing Firestore with explicit region endpoint...");
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true, // Use long polling instead of WebSockets
  host: "eur3-firestore.googleapis.com:443", // Explicit region endpoint
  ssl: true
});

// Test data
const testDoc = {
  name: "Client Test Document",
  description: "Testing client SDK connectivity with eur3 region",
  timestamp: new Date().toISOString(),
  testId: `test-${Date.now()}`
};

// Retry mechanism for Firestore operations
async function withRetry(operation, maxRetries = 3, initialDelay = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}...`);
      const result = await operation();
      return result;
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        console.error('Max retries reached.');
        throw error;
      }
      
      // Exponential backoff
      const delayMs = initialDelay * Math.pow(2, attempt-1);
      console.log(`⏳ Waiting ${delayMs/1000} seconds before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

// Function to test Firestore connectivity
async function testFirestore() {
  try {
    console.log("🔄 Testing Firestore connectivity with client SDK...");
    
    // Try to create a test document with retry
    console.log("🔄 Creating test document...");
    const docRef = await withRetry(async () => {
      return await addDoc(collection(db, 'test_collection'), testDoc);
    });
    console.log("✅ Document created with ID:", docRef.id);
    
    // Try to read the specific document with retry
    console.log("🔄 Reading specific document back...");
    const docSnap = await withRetry(async () => {
      return await getDoc(doc(db, 'test_collection', docRef.id));
    });
    
    if (docSnap.exists()) {
      console.log("✅ Successfully read document:", JSON.stringify(docSnap.data()));
    } else {
      console.error("❌ Document not found after creation!");
      return false;
    }
    
    // Try to read from the collection with retry
    console.log("🔄 Reading from test_collection...");
    const querySnapshot = await withRetry(async () => {
      return await getDocs(collection(db, 'test_collection'));
    });
    
    console.log(`✅ Found ${querySnapshot.size} documents in test_collection`);
    querySnapshot.forEach((doc) => {
      console.log("- Document:", doc.id, JSON.stringify(doc.data()));
    });
    
    // Try to delete the test document with retry
    console.log("🔄 Cleaning up: deleting test document...");
    await withRetry(async () => {
      return await deleteDoc(doc(db, 'test_collection', docRef.id));
    });
    console.log("✅ Test document deleted successfully");
    
    return true;
  } catch (error) {
    console.error("❌ Error testing Firestore:", error);
    return false;
  }
}

// Run the test
async function runTest() {
  // Add a timeout for the entire test
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Test timed out after 30 seconds"));
    }, 30000); // 30 second timeout
  });
  
  try {
    // Race between the test and the timeout
    await Promise.race([
      testFirestore(),
      timeoutPromise
    ]).then(result => {
      if (result === true) {
        console.log("\n✅ FIRESTORE CLIENT TEST PASSED: Successfully connected to Firestore");
        console.log("The database connection is working correctly!");
      } else {
        console.log("\n❌ FIRESTORE CLIENT TEST FAILED: Could not connect to Firestore");
        console.log("Please check your Firebase console to ensure the database exists and has appropriate security rules.");
      }
    });
  } catch (error) {
    console.error("\n❌ Test execution failed:", error.message);
  } finally {
    process.exit(0);
  }
}

// Execute the test
runTest();