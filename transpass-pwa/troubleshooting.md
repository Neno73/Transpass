# Firebase Database Troubleshooting

## Current Status
- Firebase configuration is set up correctly with valid API keys
- Environment variables are configured in .env file
- Firestore database can be accessed (collections are detected)
- All collections (products, users, companies) exist but are empty
- Experiencing "NOT_FOUND" errors on write operations

## Required Steps
1. The Firestore database needs to be manually created in the Firebase Console:
   - Go to https://console.firebase.google.com/
   - Select project "q-project-97c6f"
   - Navigate to "Firestore Database" in the left menu
   - Click "Create database" if it hasn't been created yet
   - Choose region (preferably eur3 as mentioned in the code)
   - Set up security rules

2. Update the service account file:
   - The firebase-service-account.json contains placeholder values
   - Download a valid service account key from the Firebase Console
   - Replace the contents of firebase-service-account.json with the actual values

3. Verify Firestore Rules:
   - Ensure Firestore security rules allow read/write operations
   - Initially, you can set rules to test mode (not recommended for production):
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

## Next Steps
Once these setup steps are completed, the database functionality should work correctly.