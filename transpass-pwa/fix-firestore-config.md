# Fixing Firestore Configuration

We've created the Firestore database in the Firebase Console, but we're still encountering "NOT_FOUND" errors. This is likely because the database name you created ("claude-transpass") doesn't match the expected project ID in the service account ("q-project-97c6f").

## Required Fixes

You have two options:

### Option 1: Create a new Firestore database with the correct name
1. Go back to Firebase Console
2. Delete the "claude-transpass" database
3. Create a new database using the project ID "q-project-97c6f"
4. Configure security rules as before

### Option 2: Update the configuration in code to work with your new database name
1. Go to the Firebase Console
2. Confirm that the database name is "claude-transpass"
3. Update the admin initialization:

```javascript
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  projectId: "claude-transpass" // Override the project ID to match your database name
});

// Use a custom Firestore settings object
const db = admin.firestore();
db.settings({
  projectId: "claude-transpass"
});
```

## Other Potential Issues

If you're still experiencing issues, check:

1. **Region Mismatch**: Ensure the database region matches what's expected in code
2. **Service Account Permissions**: Verify the service account has appropriate permissions
3. **Network/Firewall Issues**: Make sure there are no network restrictions blocking Firestore connections

Try running the database test with verbose logging enabled:

```
GCLOUD_DEBUG=true node init-dev-db.js
```