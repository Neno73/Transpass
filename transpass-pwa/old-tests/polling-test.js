const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

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

// Initialize Firebase with polling approach
const app = initializeApp(firebaseConfig);

// Initialize Firestore with long polling and cache settings
const db = getFirestore(app, {
  experimentalForceLongPolling: true, // Use long polling instead of WebSockets
});

// Test writing to Firestore
async function testWrite() {
  try {
    console.log("Testing write with long polling...");
    
    const testDoc = {
      name: "Long Polling Test",
      description: "Testing Firestore with long polling",
      timestamp: serverTimestamp()
    };
    
    console.log("Attempting to write to Firestore...");
    const docRef = await addDoc(collection(db, "polling_test"), testDoc);
    
    console.log("Document written successfully with ID:", docRef.id);
    return true;
  } catch (error) {
    console.error("Error writing document:", error);
    return false;
  }
}

// Run the test with a timeout
async function runTest() {
  console.log("Starting Firestore long polling test...");
  
  const timeout = setTimeout(() => {
    console.log("Test timed out after 15 seconds");
    process.exit(1);
  }, 15000);
  
  try {
    const result = await testWrite();
    if (result) {
      console.log("TEST PASSED: Successfully wrote to Firestore!");
      console.log("\nRecommendations:");
      console.log("1. The long polling approach seems to work");
      console.log("2. Update your firebase.ts file to use this approach");
      console.log("3. This works around the region issues you're experiencing");
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