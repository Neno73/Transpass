// Script to purge all Firestore collections
require('dotenv').config({ path: '.env.local' });

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  deleteDoc, 
  doc 
} = require('firebase/firestore');

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to delete all documents in a collection
async function deleteCollection(collectionName) {
  try {
    console.log(`Deleting all documents in ${collectionName}...`);
    const snapshot = await getDocs(collection(db, collectionName));
    
    if (snapshot.empty) {
      console.log(`No documents found in ${collectionName}`);
      return;
    }
    
    console.log(`Found ${snapshot.size} documents in ${collectionName}`);
    
    const deletePromises = [];
    snapshot.forEach(document => {
      console.log(`Deleting document ${document.id}`);
      deletePromises.push(deleteDoc(doc(db, collectionName, document.id)));
    });
    
    await Promise.all(deletePromises);
    console.log(`Successfully deleted all documents in ${collectionName}`);
  } catch (error) {
    console.error(`Error deleting collection ${collectionName}:`, error);
  }
}

// Main function to purge all collections
async function purgeCollections() {
  try {
    // Delete all documents from Firestore collections
    await deleteCollection('users');
    await deleteCollection('products');
    await deleteCollection('companies');
    
    console.log('All collections have been purged successfully!');
  } catch (error) {
    console.error('Error purging collections:', error);
  }
}

// Run the purge operation
purgeCollections().then(() => {
  console.log('Purge complete');
  process.exit(0);
}).catch(error => {
  console.error('Error during purge:', error);
  process.exit(1);
});