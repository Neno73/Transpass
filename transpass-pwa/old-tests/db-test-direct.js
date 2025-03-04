const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "your-firebase-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.firebasestorage.app",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
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