const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, getDoc } = require('firebase/firestore');

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