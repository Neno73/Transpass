# Firestore Connection Fixes Implementation

This document outlines the changes we've made to resolve the Firestore "NOT_FOUND" errors in the Transpass PWA application.

## 1. Root Cause Analysis

The primary issue was the connection to the Firestore database in the `eur3` multi-region without proper region-specific configuration. Key contributing factors:

- Missing explicit region endpoint configuration
- No error handling or retry mechanism
- Potential database propagation delay issues
- Default connection methods not optimized for multi-region databases

## 2. Implemented Solutions

### 2.1 Explicit Region Endpoint Configuration

In `lib/firebase.ts`, we updated the Firestore initialization to explicitly target the eur3 region:

```javascript
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true,
  host: "eur3-firestore.googleapis.com:443", // Explicit region endpoint
  ssl: true
});
```

### 2.2 Retry Mechanism with Exponential Backoff

We implemented a retry mechanism to handle temporary connectivity issues and propagation delays:

```javascript
export const connectWithRetry = async (maxRetries = 5, initialDelay = 5000) => {
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

### 2.3 Connection Verification Tools

Created two testing tools to verify connectivity:

1. `verify-firestore.js` - Server-side verification
2. `client-db-test.js` - Client-side verification with retry mechanism

Both tools include:
- Explicit eur3 region configuration
- Retry logic with exponential backoff
- Comprehensive error reporting
- Timeout handling

## 3. Testing and Verification

1. Run `node verify-firestore.js` to test server-side connectivity
2. Run `node client-db-test.js` to test client-side connectivity
3. If both tests pass, the Firestore connection issue is resolved

## 4. Additional Configuration Options

### For Web SDK (Client Side)

```javascript
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true,
  host: "eur3-firestore.googleapis.com:443",
  ssl: true
});
```

### For Admin SDK (Server Side)

```javascript
const admin = require('firebase-admin');
const firestore = admin.firestore();
firestore.settings({
  host: "eur3-firestore.googleapis.com:443", 
  ssl: true
});
```

## 5. Troubleshooting Remaining Issues

If you continue to experience issues:

1. **Check Database Name**: Ensure the database name in Firebase Console matches the project ID in your configuration.

2. **Verify Service Account Permissions**: The service account may need regeneration or additional permissions:
   ```bash
   gcloud iam service-accounts keys create path/to/new-key.json \
       --iam-account=YOUR-SERVICE-ACCOUNT@appspot.gserviceaccount.com
   ```

3. **Network Connectivity**: If running in a containerized or restricted environment, ensure outbound traffic is allowed to:
   - `*.googleapis.com`
   - `*.firebaseio.com`
   - `*.firebaseapp.com`

4. **Database Creation Confirmation**: Manually verify in the Firebase Console that the Firestore database exists in the correct region.

## 6. Next Steps

1. Monitor the application to ensure consistent database connectivity
2. Add additional error handling throughout the application for database operations
3. Consider implementing offline capabilities for improved resilience

---

These changes should resolve the Firestore connection issues. If problems persist, please revisit the Firebase Console settings and ensure they align with the configuration in the application.