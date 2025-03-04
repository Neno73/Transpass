const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, getDoc } = require('firebase/firestore');

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

// Test reading from the 'products' collection
async function testReadProducts() {
  try {
    console.log("Testing read access to products collection...");
    const querySnapshot = await getDocs(collection(db, 'products'));
    
    console.log(`Found ${querySnapshot.size} products:`);
    querySnapshot.forEach((doc) => {
      console.log(`- ${doc.id}: ${doc.data().name}`);
    });
    
    return true;
  } catch (error) {
    console.error("Error reading products:", error);
    return false;
  }
}

// Run the tests with a timeout
async function runTests() {
  console.log("Starting Firebase database connectivity test...");
  
  // Add a timeout to prevent hanging
  const timeout = setTimeout(() => {
    console.log("Test timed out - might be a connectivity or permissions issue");
    process.exit(1);
  }, 15000);
  
  try {
    // Test reading products
    const readSuccess = await testReadProducts();
    
    if (readSuccess) {
      console.log("Database read test passed successfully!");
    } else {
      console.log("Database read test failed");
    }
  } catch (error) {
    console.error("Test failed with error:", error);
  } finally {
    clearTimeout(timeout);
    console.log("Test completed");
    process.exit(0);
  }
}

// Run the tests
runTests();