# Setting up Vercel Deployment

This document guides you through setting up your Vercel deployment for Transpass.

## Prerequisites

1. A GitHub account connected to Vercel
2. A Firebase project (use the existing one or create a new one)

## Step 1: Deploy on Vercel

1. Go to [Vercel New Project](https://vercel.com/new)
2. Select your repository: `Neno73/Transpass`
3. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `transpass-pwa`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

## Step 2: Configure Environment Variables

In the Vercel dashboard, go to your project settings → Environment Variables and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
NEXT_PUBLIC_BASE_URL=https://your-vercel-app-url.vercel.app
```

> Important: Replace the placeholder values above with your actual Firebase configuration values. Never commit these values to your repository.

## Step 3: Add Firebase Admin Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/) → Project Settings → Service Accounts
2. Click "Generate new private key" to download a new JSON file
3. In Vercel, add a new environment variable:
   - Name: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - Value: The entire JSON content of the downloaded file
   
This secure approach avoids storing the service account key in your repository.

## Step 4: Trigger Deployment

1. Go to the "Deployments" tab in your Vercel project
2. Click "Redeploy" to apply the environment variables

## Important Security Note

Since the Firebase keys were previously exposed in a public repository, you should:

1. Regenerate your Firebase API keys from the Firebase Console
2. Update the new keys in your Vercel environment variables
3. Revoke any compromised service account keys

## Troubleshooting

If you encounter issues:

1. Check the Vercel deployment logs for errors
2. Verify all environment variables are correctly set
3. Ensure the Firebase project has all required services enabled
4. Check that your browser's console doesn't show any Firebase connection errors

## Next Steps

1. Set up a custom domain (optional)
2. Configure Vercel Analytics for monitoring
3. Set up staging environments for testing features