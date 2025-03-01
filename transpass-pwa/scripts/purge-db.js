// Script to purge all data from Firebase
require('dotenv').config({ path: '.env.local' });

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  deleteDoc, 
  doc,
  query,
  limit
} = require('firebase/firestore');
const { 
  getAuth, 
  listUsers, 
  deleteUser 
} = require('firebase-admin/auth');
const { 
  initializeApp: initializeAdminApp, 
  applicationDefault, 
  cert 
} = require('firebase-admin/app');

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

// Initialize Firebase Admin with service account
let serviceAccount;
try {
  // Try to load from environment variable first
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Otherwise load from file
    serviceAccount = require('../firebase-service-account.json');
  }
} catch (error) {
  console.error('Error loading service account:', error);
  console.log('Please create a firebase-service-account.json file in the root directory');
  console.log('or set the FIREBASE_SERVICE_ACCOUNT environment variable');
  process.exit(1);
}

// Initialize Firebase and Firebase Admin
const app = initializeApp(firebaseConfig);
const adminApp = initializeAdminApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);
const auth = getAuth(adminApp);

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

// Function to delete all users from Firebase Authentication
async function deleteAllUsers() {
  try {
    console.log('Deleting all users from Firebase Authentication...');
    
    // Get the list of users (pagination limit of 1000)
    const listUsersResult = await auth.listUsers();
    
    if (!listUsersResult.users.length) {
      console.log('No users found');
      return;
    }
    
    console.log(`Found ${listUsersResult.users.length} users`);
    
    const deletePromises = listUsersResult.users.map(user => {
      console.log(`Deleting user ${user.uid} (${user.email})`);
      return auth.deleteUser(user.uid);
    });
    
    await Promise.all(deletePromises);
    console.log('Successfully deleted all users');
  } catch (error) {
    console.error('Error deleting users:', error);
  }
}

// Main function to purge all data
async function purgeAllData() {
  try {
    // Delete all users from Firebase Authentication
    await deleteAllUsers();
    
    // Delete all documents from Firestore collections
    await deleteCollection('users');
    await deleteCollection('products');
    await deleteCollection('companies');
    
    console.log('All data has been purged successfully!');
  } catch (error) {
    console.error('Error purging data:', error);
  } finally {
    process.exit(0);
  }
}

// Run the purge operation
purgeAllData();