// Check if firebase-admin is installed
try {
  require('firebase-admin');
  console.log("Firebase Admin SDK is installed");
} catch (error) {
  console.log("Firebase Admin SDK is not installed. Installing...");
  require('child_process').execSync('npm install firebase-admin', {stdio: 'inherit'});
  console.log("Firebase Admin SDK installed successfully");
}

const admin = require('firebase-admin');

// Initialize Firebase Admin (without credentials - this assumes you're authenticated via gcloud)
try {
  admin.initializeApp({
    projectId: 'q-project-97c6f'
  });

  console.log("Firebase Admin initialized successfully");

  // Test connecting to Firestore
  const db = admin.firestore();
  console.log("Firestore instance created");
  
  // Test creating a document
  const testData = {
    name: 'Test Document',
    description: 'Created via Admin SDK',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  db.collection('admin_test').add(testData)
    .then(docRef => {
      console.log("Document successfully created with ID:", docRef.id);
      console.log("Firebase Admin SDK test PASSED!");
    })
    .catch(error => {
      console.error("Error creating document:", error);
      console.log("Firebase Admin SDK test FAILED");
    });
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
}