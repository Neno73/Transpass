# Firebase Firestore "NOT_FOUND" Error - Complete Solution

Based on our testing, we've consistently encountered a "NOT_FOUND" error when trying to connect to the Firestore database. This indicates that the database does not exist yet or is not properly configured in the Firebase project.

## Core Issue

The consistent `5 NOT_FOUND` error from both client SDK and Admin SDK connections strongly suggests that **the Firestore database has not been created yet in the Firebase Console**.

## Required Manual Step

Before any code changes will work, you **must first create the database in the Firebase Console**:

1. Go to [Firebase Console](https://console.firebase.google.com/project/q-project-97c6f/firestore)
2. Select project "q-project-97c6f"
3. In the left navigation menu, click on "Firestore Database"
4. Click "Create database" button
5. Choose "Test mode" for development purposes
6. **IMPORTANT**: Select region "eur3 (europe-west)"
7. Click "Enable"

## Code Changes

After creating the database, our implementation includes these key modifications:

### 1. Client SDK Configuration (lib/firebase.ts)

```javascript
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true, // Use long polling instead of WebSockets
  host: "eur3-firestore.googleapis.com:443", // Explicit region endpoint
  ssl: true
});
```

### 2. Admin SDK Configuration (for server-side usage)

```javascript
const admin = require('firebase-admin');
const firestore = admin.firestore();
firestore.settings({
  host: "eur3-firestore.googleapis.com", 
  ssl: true
});
```

### 3. Retry Mechanism

We've added a retry mechanism with exponential backoff for more resilient connections:

```javascript
const connectWithRetry = async (maxRetries = 5, initialDelay = 5000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Try a simple operation
      const testRef = db.collection('_connectivity_test').doc('test');
      await testRef.set({timestamp: Date.now()});
      console.log('Connected to Firestore successfully');
      return true;
    } catch (error) {
      console.log(`Connection attempt ${attempt} failed: ${error.message}`);
      
      if (attempt === maxRetries) {
        console.error('Max retries reached. Database may still be propagating.');
        return false;
      }
      
      // Exponential backoff
      const delayMs = initialDelay * Math.pow(2, attempt-1);
      console.log(`Waiting ${delayMs/1000} seconds before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
};
```

## Verification Steps

After creating the database, verify the connection with our test scripts:

1. `node verify-firestore.js` - Tests client-side connectivity
2. `node admin-sdk-test.js` - Tests server-side connectivity 

## Potential Issues 

If issues persist after creating the database, check:

1. **Project ID Match**: Ensure the project ID in your code (`q-project-97c6f`) matches the Firebase project ID.

2. **Region Selection**: Make sure you selected "eur3" when creating the database, as our code is configured for this region.

3. **Service Account Permissions**: The service account may need the "Cloud Datastore User" IAM role.

4. **Database Propagation**: New databases may take several minutes to fully propagate through Google's infrastructure.

## Next Steps

1. Create the database in Firebase Console
2. Run the verification scripts
3. If successful, continue with app development
4. If issues persist, review "Potential Issues" above

---

Remember: No amount of code changes will fix this issue without first creating the database in the Firebase Console.