# Deploying Job Board to Firebase (Free Plan)

This guide explains how to deploy the Job Board application to Firebase using the free Spark plan without upgrading to the Blaze (pay-as-you-go) plan.

## Prerequisites

1. Make sure you have the Firebase CLI installed:
   ```
   npm install -g firebase-tools
   ```

2. Log in to Firebase:
   ```
   firebase login
   ```

## Deployment Steps

### 1. Build the Application

First, build your React application:

```bash
npm run build
```

This will create a `dist` folder with the compiled application.

### 2. Deploy to Firebase

Deploy the application to Firebase:

```bash
firebase deploy
```

This will deploy:
- The web application to Firebase Hosting
- The free-plan compatible Cloud Functions
- Firestore security rules and indexes

## Free Plan Limitations

The application has been modified to work with Firebase's free Spark plan by:

1. **Removing Email Functionality**: The email sending functionality has been replaced with in-app notifications stored in Firestore.

2. **Using Firestore for Notifications**: Instead of sending emails, the application now stores notifications in Firestore that users can see in their dashboard.

3. **Simplified Cloud Functions**: The Cloud Functions have been simplified to avoid making external network requests, which are not allowed on the free plan.

## Troubleshooting

If you encounter issues during deployment:

1. **"Billing account required" error**: Make sure you're using the modified functions in `functions-new/index-free.js` which are compatible with the free plan.

2. **Function deployment fails**: Try deploying only the hosting component:
   ```
   firebase deploy --only hosting
   ```

3. **Firestore permission issues**: Make sure your Firestore security rules in `firestore.rules` are properly configured.

## Upgrading Later

If you decide to upgrade to the Blaze plan later, you can restore the full functionality:

1. Update `firebase.json` to use the original functions:
   ```json
   "functions": {
     "source": "functions-new"
   }
   ```

2. Deploy the full version:
   ```
   firebase deploy
   ```

This will enable email notifications and other features that require the Blaze plan.