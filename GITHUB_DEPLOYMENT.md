# Deploying with GitHub Actions

This project is set up to automatically deploy to Firebase Hosting and Functions using GitHub Actions. Here's how it works and how to set it up.

## How It Works

1. When you push to the `main` branch, GitHub Actions will:
   - Build your frontend application
   - Install dependencies for Firebase Functions
   - Deploy both to Firebase

2. When you create a pull request, GitHub Actions will:
   - Build your frontend application
   - Install dependencies for Firebase Functions
   - Create a preview deployment for review

## Setup Instructions

### 1. Set up Firebase CLI Authentication

You need to create a Firebase token for GitHub Actions to authenticate with Firebase:

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Generate a CI token
firebase login:ci
```

Copy the token that is generated.

### 2. Add Secrets to GitHub Repository

Go to your GitHub repository settings:
1. Navigate to "Settings" > "Secrets and variables" > "Actions"
2. Add the following secrets:
   - `FIREBASE_TOKEN`: The token you generated with `firebase login:ci`
   - `FIREBASE_SERVICE_ACCOUNT_JOB_BOARD_WEB`: This should already be set up if you used Firebase CLI to initialize GitHub Actions

### 3. Verify Workflow Files

The workflow files are located in `.github/workflows/`:
- `firebase-hosting-merge.yml`: Handles deployments when pushing to main
- `firebase-hosting-pull-request.yml`: Handles preview deployments for pull requests

### 4. Push to GitHub

Once you've set up the secrets, push your code to GitHub:

```bash
git add .
git commit -m "Set up GitHub Actions for Firebase deployment"
git push
```

## Troubleshooting

If you encounter issues with the deployment:

1. Check the GitHub Actions logs in your repository under the "Actions" tab
2. Verify that all required secrets are properly set
3. Make sure your Firebase project is correctly set up and the project ID matches in your configuration files

## Manual Deployment

You can still deploy manually if needed:

```bash
# Build the frontend
npm run build

# Deploy to Firebase
firebase deploy
```