const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc } = require('firebase/firestore');

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: "your-firebase-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.firebasestorage.app",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "G-T84C9N4EG2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test data
const testProduct = {
  name: "Test Product",
  description: "This is a test product created by the database test script",
  manufacturer: "Test Manufacturer",
  model: "TEST-123",
  createdBy: "test-script",
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
async function getTestProduct(productId) {
  try {
    console.log("Retrieving test product...");
    const q = query(
      collection(db, 'products'),
      where("name", "==", testProduct.name)
    );
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log("Retrieved products:", products);
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
  console.log("Starting Firebase Firestore database test...");
  let productId;
  
  try {
    // Create test product
    productId = await createTestProduct();
    
    // Retrieve test product
    const products = await getTestProduct();
    
    if (products.length > 0) {
      console.log("TEST PASSED: Successfully created and retrieved test product");
      
      // Clean up - delete the test product
      await deleteTestProduct(products[0].id);
    } else {
      console.log("TEST FAILED: Could not retrieve the created test product");
    }
  } catch (error) {
    console.error("TEST FAILED:", error);
  }
  
  console.log("Database test completed");
}

// Execute the test
runTest();