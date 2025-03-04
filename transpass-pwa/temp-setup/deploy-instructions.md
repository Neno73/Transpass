# Vercel Deployment Instructions

## Step 1: Create a new project on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository (Neno73/Transpass)
3. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: transpass-pwa
   - Build Command: npm run build
   - Output Directory: .next

## Step 2: Add environment variables

Add the following environment variables in the Vercel dashboard (Settings > Environment Variables):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

> Important: Replace these placeholder values with your actual Firebase configuration.

## Step 3: Set up Firebase Admin SDK

1. Create a new service account key in Firebase Console:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the file securely

2. Add the following environment variable containing the entire service account JSON:
   ```
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}
   ```
   (Copy the entire JSON content from your service account key file into this variable)

## Step 4: Deploy

1. Click "Deploy" 
2. After deployment completes, your app will be available at the URL provided by Vercel

## Regenerate Firebase credentials

⚠️ **IMPORTANT SECURITY NOTE** ⚠️

Since the Firebase keys were previously exposed in the git repository, you should regenerate them:

1. Go to Firebase Console > Project Settings
2. In the "General" tab, scroll down to "Your apps" section
3. Click the "⋮" menu next to your web app and select "Manage API key"
4. Regenerate the API key
5. Update the API key in your Vercel environment variables

## Vercel CLI Deployment (Alternative)

You can also deploy using the Vercel CLI:

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to the project root: `cd transpass-pwa`
3. Run: `vercel`
4. Follow the prompts to link to your Vercel account
5. Set environment variables when prompted or via the dashboard
