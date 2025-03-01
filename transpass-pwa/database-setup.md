# Firebase Database Setup Instructions

The Firebase project is correctly configured with API keys and service account credentials, but we're still receiving "NOT_FOUND" errors. This suggests the Firestore database hasn't been created in the Firebase Console.

## Manual Setup Required

Please complete these steps in the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project "q-project-97c6f"
3. In the left navigation menu, click on "Firestore Database"
4. Click "Create database" button
5. Choose either "Production mode" or "Test mode" (for development, Test mode is easier)
6. Select a region (preferably eur3 as indicated in the code)
7. Click "Enable"

## Security Rules

After creating the database, set appropriate security rules:

For development purposes, you can use test mode rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For production, you'll want to implement proper authentication rules.

## Next Steps

Once the Firestore database is created in the Firebase Console, run the database tests again to verify connectivity:

```
node simple-read-test.js
```

The error "NOT_FOUND" typically means the database itself doesn't exist yet, not just that collections are missing.