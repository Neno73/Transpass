# IMPORTANT: Firestore Database Creation Required

## Critical Issue
The persistent "NOT_FOUND" errors from both client and Admin SDK connections confirm that **the Firestore database has not been created in the Firebase project**. No code changes will fix this issue until the database is created.

## Required Manual Steps

1. Go to the Firebase Console: https://console.firebase.google.com/
2. Select your project: "q-project-97c6f"
3. In the left navigation menu, click on "Firestore Database"
4. Click "Create database" button
5. Select "Start in test mode" for development purposes
6. For region selection, select "europe-west" (the nearest to your location)
7. Click "Enable"
8. Wait approximately 1-2 minutes for the database to initialize

## Important Notes

- This step cannot be automated - it must be done manually in the Firebase Console
- Until the database is created, all connection attempts will fail with "NOT_FOUND"
- The error is not a code issue, but rather that the database resource does not exist
- Firebase projects do not automatically create a Firestore database; it must be done explicitly

## After Database Creation

After you've created the database in the Firebase Console, our test scripts should work without further modification. We recommend:

1. Running `node admin-sdk-test-v2.js` to verify the Admin SDK connection
2. Running `node verify-firestore.js` to verify the client SDK connection

If you continue to experience issues after database creation, possible causes include:

1. IAM permission issues with the service account
2. Network connectivity restrictions
3. Firestore security rules blocking access
4. Database still in the process of propagating (can take several minutes)

## Configuration

We've already implemented the correct SDK configurations in:
- `lib/firebase.ts` (client SDK)
- `lib/firebase-admin.js` (Admin SDK)

No further code changes should be needed once the database exists.