const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, serverTimestamp, enableIndexedDbPersistence } = require('firebase/firestore');
const { getAuth, signInAnonymously } = require('firebase/auth');

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
const db = getFirestore(app);
const auth = getAuth(app);

// Enable offline persistence (this might help with connectivity issues)
enableIndexedDbPersistence(db)
  .then(() => {
    console.log("Offline persistence enabled");
  })
  .catch((err) => {
    console.error("Error enabling offline persistence:", err.code);
  });

// Test functions
async function readTest() {
  try {
    console.log("Testing read access...");
    const querySnapshot = await getDocs(collection(db, 'test_collection'));
    console.log(`Found ${querySnapshot.size} documents in test_collection`);
    querySnapshot.forEach(doc => {
      console.log(`- ${doc.id}: ${JSON.stringify(doc.data())}`);
    });
    return true;
  } catch (error) {
    console.error("Read test error:", error);
    return false;
  }
}

async function writeTest() {
  try {
    console.log("Testing write access...");
    const data = {
      message: "Test document",
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'test_collection'), data);
    console.log("Document written with ID:", docRef.id);
    return true;
  } catch (error) {
    console.error("Write test error:", error.code, error.message);
    if (error.code === 'unavailable') {
      console.error("The Firestore service is unavailable. This might indicate the database hasn't been created yet in the Firebase console.");
    } else if (error.code === 'permission-denied') {
      console.error("Permission denied. Check your Firestore security rules.");
    } else if (error.code === 'not-found') {
      console.error("Resource not found. Ensure you've created the Firestore database in the Firebase console.");
    }
    return false;
  }
}

// Run all tests with a timeout
async function runTests() {
  console.log("Starting comprehensive Firebase database tests...");
  
  // Add a timeout
  const timeout = setTimeout(() => {
    console.log("\n========== TEST TIMEOUT ==========");
    console.log("Tests timed out after 15 seconds. Possible issues:");
    console.log("1. The Firestore database might not be fully initialized yet");
    console.log("2. There might be connectivity issues between your machine and Firebase");
    console.log("3. The Firebase project might not be properly configured");
    console.log("4. The Firestore security rules might be blocking access");
    console.log("5. The Firebase project ID or credentials might be incorrect");
    console.log("\nPlease check the Firebase console to ensure Firestore is properly set up.");
    process.exit(1);
  }, 15000);
  
  try {
    // First try to read (this should work even if writes are restricted)
    const readSuccess = await readTest();
    console.log("Read test:", readSuccess ? "PASSED" : "FAILED");
    
    // Then try to write
    const writeSuccess = await writeTest();
    console.log("Write test:", writeSuccess ? "PASSED" : "FAILED");
    
    console.log("\n========== TEST SUMMARY ==========");
    if (readSuccess && writeSuccess) {
      console.log("All tests PASSED! Firebase database is properly configured and accessible.");
    } else if (readSuccess && !writeSuccess) {
      console.log("Read test PASSED but write test FAILED.");
      console.log("This suggests there may be permission issues with the Firestore rules.");
      console.log("Check your Firestore security rules in the Firebase Console.");
    } else {
      console.log("Both read and write tests FAILED.");
      console.log("This suggests there may be more fundamental connectivity or configuration issues.");
    }
  } catch (error) {
    console.error("Unexpected error during tests:", error);
  } finally {
    clearTimeout(timeout);
    process.exit(0);
  }
}

// Run the tests
runTests();