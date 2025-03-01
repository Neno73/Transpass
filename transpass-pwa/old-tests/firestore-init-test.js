const { initializeApp } = require('firebase/app');
const { initializeFirestore, CACHE_SIZE_UNLIMITED, collection, addDoc } = require('firebase/firestore');

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
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific settings for compatibility with eur3 region
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true, // Use long polling instead of WebSockets
});

// Test writing to Firestore
async function testWrite() {
  try {
    console.log("Testing Firestore write with initializeFirestore...");
    
    const testDoc = {
      name: "Initialize Test",
      description: "Testing with initializeFirestore",
      timestamp: new Date().toISOString()
    };
    
    console.log("Attempting to write to Firestore...");
    const docRef = await addDoc(collection(db, "init_test"), testDoc);
    
    console.log("Document written successfully with ID:", docRef.id);
    return true;
  } catch (error) {
    console.error("Error writing document:", error);
    return false;
  }
}

// Run test with timeout
async function runTest() {
  console.log("Starting Firestore initialization test...");
  
  const timeout = setTimeout(() => {
    console.log("\nTest timed out after 15 seconds.");
    console.log("\nRecommendations for Firebase Firestore Configuration:");
    console.log("1. In Firebase Console, verify that Firestore is fully provisioned");
    console.log("2. Check if any firewall is blocking Firebase connections");
    console.log("3. Try connecting from a different network");
    console.log("4. Try creating collections manually in the Firebase Console");
    console.log("5. Wait a couple of hours for the database to fully initialize");
    process.exit(1);
  }, 15000);
  
  try {
    const result = await testWrite();
    if (result) {
      console.log("TEST PASSED: Successfully wrote to Firestore using initializeFirestore!");
    } else {
      console.log("TEST FAILED: Unable to write to Firestore");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  } finally {
    clearTimeout(timeout);
    process.exit(0);
  }
}

// Run the test
runTest();