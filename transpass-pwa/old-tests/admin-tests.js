const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

// Initialize the app with admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

// Get Firestore instance
const db = admin.firestore();

// Function to create collections if they don't exist
async function ensureCollectionsExist() {
  try {
    console.log("Checking for required collections...");
    
    // List of collections to check/create
    const collections = ['products', 'users', 'companies'];
    
    for (const collectionName of collections) {
      console.log(`Checking collection: ${collectionName}`);
      
      // Check if collection exists by trying to get a document
      const snapshot = await db.collection(collectionName).limit(1).get();
      
      if (snapshot.empty) {
        console.log(`Creating test document in collection: ${collectionName}`);
        
        // Create a test document to ensure the collection exists
        const testDoc = {
          name: "Test Document",
          description: `Test document for ${collectionName} collection`,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        // Add a document to create the collection
        const docRef = await db.collection(collectionName).add(testDoc);
        console.log(`Created test document with ID: ${docRef.id}`);
        
        // Delete the test document to keep collections clean
        await db.collection(collectionName).doc(docRef.id).delete();
        console.log(`Deleted test document from ${collectionName}`);
      } else {
        console.log(`Collection ${collectionName} already exists`);
      }
    }
    
    console.log("All required collections exist or have been created");
    return true;
  } catch (error) {
    console.error("Error setting up collections:", error);
    return false;
  }
}

// Run the setup
async function runSetup() {
  try {
    await ensureCollectionsExist();
    console.log("Database setup completed successfully");
  } catch (error) {
    console.error("Database setup failed:", error);
  } finally {
    process.exit();
  }
}

// Execute the setup
runSetup();