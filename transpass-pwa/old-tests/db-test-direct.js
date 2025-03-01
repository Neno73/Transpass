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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Create a test document in a test collection
async function createTestDocument() {
  try {
    console.log("Attempting to create a test document...");
    
    const docRef = await addDoc(collection(db, 'test_collection'), {
      name: "Test Document",
      description: "This is a test document",
      created_at: serverTimestamp()
    });
    
    console.log("Document created with ID:", docRef.id);
    return true;
  } catch (error) {
    console.error("Error creating document:", error);
    return false;
  }
}

// Run with timeout
async function runTest() {
  console.log("Starting direct Firebase write test...");
  
  // Add a timeout
  const timeout = setTimeout(() => {
    console.log("Test timed out after 10 seconds");
    process.exit(1);
  }, 10000);
  
  try {
    const success = await createTestDocument();
    
    if (success) {
      console.log("Firebase database write test PASSED!");
    } else {
      console.log("Firebase database write test FAILED");
    }
  } catch (error) {
    console.error("Test failed with error:", error);
  } finally {
    clearTimeout(timeout);
    console.log("Test completed");
    process.exit(0);
  }
}

// Run the test
runTest();