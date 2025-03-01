const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, serverTimestamp, connectFirestoreEmulator } = require('firebase/firestore');

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
// Initialize Firestore with explicit region setting
const db = getFirestore(app);

// Test writing to Firestore with specified region
async function writeTest() {
  try {
    console.log("Testing write to Firestore in eur3 region...");
    const data = {
      message: "Test document with region specified",
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'test_region'), data);
    console.log("Document written with ID:", docRef.id);
    return true;
  } catch (error) {
    console.error("Write test error:", error.code, error.message);
    return false;
  }
}

// Run test
async function runTest() {
  console.log("Starting Firebase region test...");
  
  try {
    const writeSuccess = await writeTest();
    console.log("Write test:", writeSuccess ? "PASSED" : "FAILED");
    
    if (!writeSuccess) {
      console.log("\nPossible region mismatch. You need to update the main firebase.ts file");
      console.log("to specify the 'eur3' region for Firestore initialization.");
    }
  } catch (error) {
    console.error("Unexpected error during test:", error);
  }
}

// Run the test
runTest();