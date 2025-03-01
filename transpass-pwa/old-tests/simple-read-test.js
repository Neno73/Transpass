require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
console.log("Initializing Firebase with config...");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to list available collections
async function listCollections() {
  try {
    console.log("Attempting to read from Firestore...");
    
    // Try to access a few common collection names
    const collections = ['products', 'users', 'companies'];
    
    for (const collectionName of collections) {
      console.log(`Checking collection: ${collectionName}`);
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        console.log(`Collection ${collectionName} exists with ${querySnapshot.size} documents`);
        
        // Print first few documents from each collection (limited to 5)
        let count = 0;
        querySnapshot.forEach((doc) => {
          if (count < 5) {
            console.log(`Document ${doc.id}:`, JSON.stringify(doc.data(), null, 2));
            count++;
          }
        });
      } catch (error) {
        console.log(`Failed to access collection ${collectionName}:`, error.message);
      }
    }
    
    console.log("Firestore read test completed");
  } catch (error) {
    console.error("Firestore read test failed:", error);
  }
}

// Run the test
listCollections();