/**
 * Simple Firestore Client Test
 * 
 * This script tests connecting to the newly created Firestore database
 * using the standard Web SDK.
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, getDoc, deleteDoc } = require('firebase/firestore');

// Firebase configuration with hardcoded credentials for testing
const firebaseConfig = {
  apiKey: "your-firebase-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.firebasestorage.app",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

console.log("🔄 Initializing Firebase...");
const app = initializeApp(firebaseConfig);

// Initialize Firestore with standard approach
console.log("🔄 Initializing Firestore...");
const db = getFirestore(app);

// Simple test function
async function testFirestore() {
  try {
    console.log("🔄 Testing Firestore connectivity...");
    
    // Create a test collection reference
    const testCollection = 'client_test_collection';
    
    console.log(`🔄 Creating test document in ${testCollection}...`);
    const testData = {
      name: "Test Document",
      created: new Date().toISOString(),
      testId: `test-${Date.now()}`
    };
    
    // Try writing a document
    const docRef = await addDoc(collection(db, testCollection), testData);
    console.log(`✅ Document written with ID: ${docRef.id}`);
    
    // Try reading the document back
    console.log(`🔄 Reading document with ID: ${docRef.id}...`);
    const docSnap = await getDoc(doc(db, testCollection, docRef.id));
    
    if (docSnap.exists()) {
      console.log(`✅ Document read successfully:`, docSnap.data());
      
      // Try reading all documents in collection
      console.log(`🔄 Reading all documents in ${testCollection}...`);
      const querySnapshot = await getDocs(collection(db, testCollection));
      console.log(`✅ Found ${querySnapshot.size} documents in collection`);
      
      // Display the first 5 documents
      console.log("Documents:");
      let count = 0;
      querySnapshot.forEach((doc) => {
        if (count < 5) {
          console.log(`- ${doc.id}: ${JSON.stringify(doc.data())}`);
          count++;
        }
      });
      
      // Clean up - delete test document
      console.log(`🔄 Cleaning up - deleting test document...`);
      await deleteDoc(doc(db, testCollection, docRef.id));
      console.log(`✅ Test document deleted successfully`);
      
      return true;
    } else {
      console.error(`❌ Document not found after creation!`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error testing Firestore:`, error);
    return false;
  }
}

// Run the test with a timeout
async function runTest() {
  console.log("🔄 Starting Firestore client test...");
  
  // Add a timeout
  const timeout = setTimeout(() => {
    console.error(`❌ Test timed out after 15 seconds`);
    console.error(`This might indicate connection issues or that the database doesn't exist`);
    process.exit(1);
  }, 15000);
  
  try {
    const result = await testFirestore();
    
    clearTimeout(timeout);
    
    if (result) {
      console.log("\n✅ SUCCESS: Firestore database is accessible!");
      console.log("The database connection is working correctly.");
    } else {
      console.log("\n❌ FAILURE: Could not access Firestore database.");
    }
  } catch (error) {
    clearTimeout(timeout);
    console.error(`\n❌ ERROR: ${error.message}`);
  } finally {
    process.exit(0);
  }
}

// Execute the test
runTest();