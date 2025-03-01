require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED
} = require('firebase/firestore');

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
console.log("Initializing Firebase with config:", JSON.stringify(firebaseConfig, null, 2));
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific settings for better compatibility
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true, // Use long polling instead of WebSockets
});

// Test data
const testProduct = {
  name: "Test Product",
  description: "This is a test product created for database connection testing",
  manufacturer: "Test Manufacturer",
  model: "TEST-CONNECTION-123",
  createdBy: "connection-test-script",
  createdAt: new Date(),
  updatedAt: new Date()
};

// Function to create a test product
async function createTestProduct() {
  try {
    console.log("Creating test product...");
    const docRef = await addDoc(collection(db, 'products'), testProduct);
    console.log("Test product created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating test product:", error);
    throw error;
  }
}

// Function to retrieve the test product
async function getTestProduct() {
  try {
    console.log("Retrieving test product...");
    const q = query(
      collection(db, 'products'),
      where("model", "==", testProduct.model)
    );
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log("Retrieved products:", JSON.stringify(products, null, 2));
    return products;
  } catch (error) {
    console.error("Error retrieving test product:", error);
    throw error;
  }
}

// Function to delete the test product
async function deleteTestProduct(productId) {
  try {
    console.log("Deleting test product:", productId);
    await deleteDoc(doc(db, 'products', productId));
    console.log("Test product deleted successfully");
  } catch (error) {
    console.error("Error deleting test product:", error);
    throw error;
  }
}

// Run the test
async function runTest() {
  console.log("Starting Firebase Firestore database connection test...");
  let productId;
  
  try {
    // Create test product
    productId = await createTestProduct();
    
    // Retrieve test product
    const products = await getTestProduct();
    
    if (products.length > 0) {
      console.log("TEST PASSED: Successfully created and retrieved test product");
      
      // Clean up - delete the test product
      for (const product of products) {
        await deleteTestProduct(product.id);
      }
    } else {
      console.error("TEST FAILED: Could not retrieve the created test product");
    }
  } catch (error) {
    console.error("TEST FAILED:", error);
  }
  
  console.log("Database connection test completed");
}

// Execute the test
runTest();