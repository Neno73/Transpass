/**
 * Simple Firestore Admin SDK Test
 * 
 * This script tests connecting to the newly created Firestore database
 * using the Admin SDK with the simplest possible configuration.
 */

const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

console.log("🔄 Initializing Firebase Admin...");

// Initialize Admin SDK with the simplest possible configuration
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get Firestore instance
const db = admin.firestore();

// Simple test function
async function testFirestore() {
  try {
    console.log("🔄 Testing Firestore Admin SDK connectivity...");
    
    // Create a test collection reference
    const testCollection = 'admin_simple_test';
    
    console.log(`🔄 Creating test document in ${testCollection}...`);
    const testData = {
      name: "Admin Test Document",
      created: new Date().toISOString(),
      testId: `admin-test-${Date.now()}`
    };
    
    // Try writing a document
    const docRef = await db.collection(testCollection).add(testData);
    console.log(`✅ Document written with ID: ${docRef.id}`);
    
    // Try reading the document back
    console.log(`🔄 Reading document with ID: ${docRef.id}...`);
    const docSnap = await db.collection(testCollection).doc(docRef.id).get();
    
    if (docSnap.exists) {
      console.log(`✅ Document read successfully:`, docSnap.data());
      
      // Try reading all documents in collection
      console.log(`🔄 Reading all documents in ${testCollection}...`);
      const querySnapshot = await db.collection(testCollection).get();
      console.log(`✅ Found ${querySnapshot.size} documents in collection`);
      
      // Clean up - delete test document
      console.log(`🔄 Cleaning up - deleting test document...`);
      await db.collection(testCollection).doc(docRef.id).delete();
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
  console.log("🔄 Starting Firestore Admin SDK test...");
  
  // Add a timeout
  const timeout = setTimeout(() => {
    console.error(`❌ Test timed out after 10 seconds`);
    console.error(`This might indicate connection issues or that the database doesn't exist`);
    process.exit(1);
  }, 10000);
  
  try {
    const result = await testFirestore();
    
    clearTimeout(timeout);
    
    if (result) {
      console.log("\n✅ SUCCESS: Firestore database is accessible with Admin SDK!");
      console.log("The database connection is working correctly.");
    } else {
      console.log("\n❌ FAILURE: Could not access Firestore database with Admin SDK.");
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