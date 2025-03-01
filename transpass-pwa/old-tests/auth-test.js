const { initializeApp } = require('firebase/app');
const { getAuth, signInAnonymously, signOut } = require('firebase/auth');

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