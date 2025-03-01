const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp, CACHE_SIZE_UNLIMITED } = require('firebase/firestore');

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

// Initialize Firestore with simpler settings
const db = getFirestore(app);

// Test writing to Firestore
async function testWrite() {
  try {
    console.log("Testing basic Firestore write...");
    
    const testDoc = {
      name: "Basic Test",
      description: "Testing basic Firestore write functionality",
      timestamp: new Date().toISOString() // Use plain Date instead of serverTimestamp
    };
    
    console.log("Attempting to write to Firestore...");
    const docRef = await addDoc(collection(db, "basic_test"), testDoc);
    
    console.log("Document written successfully with ID:", docRef.id);
    return true;
  } catch (error) {
    console.error("Error writing document:", error);
    return false;
  }
}

// Run the test with a timeout
async function runTest() {
  console.log("Starting basic Firestore write test...");
  
  const timeout = setTimeout(() => {
    console.log("Test timed out after 15 seconds");
    console.log("\nRecommendations:");
    console.log("1. Make sure you've created the Firestore database in the Firebase Console");
    console.log("2. Verify you selected the correct region (eur3)");
    console.log("3. Check Firebase Console to see if there are any pending operations");
    console.log("4. Try manually creating a collection and document in the Firebase Console");
    process.exit(1);
  }, 15000);
  
  try {
    const result = await testWrite();
    if (result) {
      console.log("TEST PASSED: Successfully wrote to Firestore!");
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