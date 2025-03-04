const { initializeApp } = require('firebase/app');
const { getAuth, signInAnonymously, signOut } = require('firebase/auth');

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
const auth = getAuth(app);

// Test anonymous authentication
async function testAnonymousAuth() {
  try {
    console.log("Testing anonymous authentication...");
    
    // Sign in anonymously
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    
    console.log("Anonymous authentication successful:", user.uid);
    
    // Sign out
    await signOut(auth);
    console.log("Signed out successfully");
    
    return true;
  } catch (error) {
    console.error("Error with authentication:", error.code, error.message);
    return false;
  }
}

// Run with timeout
async function runTest() {
  console.log("Starting Firebase Authentication test...");
  
  // Add a timeout
  const timeout = setTimeout(() => {
    console.log("Test timed out after 10 seconds");
    process.exit(1);
  }, 10000);
  
  try {
    const success = await testAnonymousAuth();
    
    if (success) {
      console.log("Firebase authentication test PASSED!");
    } else {
      console.log("Firebase authentication test FAILED");
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