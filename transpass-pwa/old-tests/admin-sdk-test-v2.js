/**
 * Admin SDK Test for Firebase Firestore (Version 2)
 * 
 * This script uses a different configuration approach for the Admin SDK
 * that might resolve the NOT_FOUND issue.
 */

const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

console.log("🔄 Initializing Firebase Admin with service account...");

// Initialize without databaseURL or projectId
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get Firestore instance
const db = admin.firestore();

// Try without region settings first
console.log("🔄 Using default Firestore settings (no explicit region)...");

// Simple test function
async function testFirestore() {
  try {
    console.log("🔄 Testing Firestore connectivity with Admin SDK...");
    
    // Create a test collection reference
    const testCollection = 'admin_test_collection';
    
    // Try to write a document
    console.log(`🔄 Attempting to write to collection: ${testCollection}...`);
    const writeResult = await db.collection(testCollection).add({
      name: 'Test Document',
      created: new Date().toISOString(),
      testId: `test-${Date.now()}`
    });
    
    console.log(`✅ Document written with ID: ${writeResult.id}`);
    
    // Try to read the document back
    console.log(`🔄 Attempting to read document: ${writeResult.id}...`);
    const doc = await db.collection(testCollection).doc(writeResult.id).get();
    
    if (doc.exists) {
      console.log(`✅ Document read successfully:`, doc.data());
      
      // Clean up - delete the test document
      console.log(`🔄 Cleaning up - deleting test document...`);
      await db.collection(testCollection).doc(writeResult.id).delete();
      console.log(`✅ Test document deleted successfully`);
      
      return true;
    } else {
      console.error(`❌ Document not found after creation!`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error testing Firestore:`, error);
    
    // Provide specific guidance for common errors
    if (error.code === 'not-found') {
      console.error(`
=== FIRESTORE DATABASE NOT FOUND ===
This error indicates that the Firestore database does not exist yet in project ${serviceAccount.project_id}.
Please create a Firestore database in the Firebase Console:
1. Go to https://console.firebase.google.com/project/${serviceAccount.project_id}/firestore
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select region "europe-west" (not eur3)
5. Click "Enable"
`);
    } else if (error.code === 'permission-denied') {
      console.error(`
=== PERMISSION DENIED ===
This error indicates that the service account does not have permission to access Firestore.
Please check IAM permissions in the GCP Console and ensure the service account has the "Cloud Datastore User" role.
`);
    }
    
    return false;
  }
}

// Run the test with a timeout
async function runTest() {
  console.log("🔄 Starting Firestore Admin SDK test...");
  
  // Add a timeout
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Test timed out after 20 seconds"));
    }, 20000);
  });
  
  try {
    // Race between the test and the timeout
    const result = await Promise.race([
      testFirestore(),
      timeoutPromise
    ]);
    
    if (result === true) {
      console.log("\n✅ SUCCESS: Firestore database is accessible with Admin SDK!");
      console.log("The database connection is working correctly. No region specification was needed.");
    } else {
      console.log("\n❌ FAILURE: Could not access Firestore database with Admin SDK.");
    }
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}`);
    
    if (error.message.includes("timed out")) {
      console.error(`
This timeout could indicate network connectivity issues or that the Firestore
database is still propagating. Please try again in a few minutes.
`);
    }
  } finally {
    process.exit(0);
  }
}

// Execute the test
runTest();