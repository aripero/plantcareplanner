# Deployment Guide for PlantCarePlanner

This guide will help you deploy PlantCarePlanner to GitHub Pages and set up Firebase Functions for email notifications.

## Prerequisites

1. A GitHub account
2. A Firebase account (free tier is sufficient)
3. Node.js and npm installed

## Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `PlantCarePlanner` (or your choice)
4. Follow the setup wizard
5. Enable Google Analytics (optional)

### 1.2 Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Google** provider
3. Add your domain to authorized domains if needed

### 1.3 Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **test mode** (for development)
4. Choose a location close to you

### 1.4 Get Firebase Configuration

1. Go to **Project Settings** > **General**
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Register your app
5. Copy the Firebase configuration object

### 1.5 Update Firebase Config in Code

Edit `src/config/firebase.js` and replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 2: Set Up Firestore Security Rules

Go to **Firestore Database** > **Rules** and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /userPlants/{plantId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 3: Set Up Firebase Functions (Email Notifications)

### 3.1 Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 3.2 Configure Firebase Functions

1. Update `.firebaserc` with your Firebase project ID
2. Navigate to `functions` directory:
   ```bash
   cd functions
   npm install
   ```

### 3.3 Configure Email Service

You have several options:

**Option A: Gmail (for testing)**
```bash
firebase functions:config:set email.user="your-email@gmail.com" email.password="your-app-password"
```

**Option B: SendGrid (recommended for production)**
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key
3. Update `functions/index.js` to use SendGrid

**Option C: Resend**
1. Sign up at [Resend](https://resend.com/)
2. Get API key
3. Update `functions/index.js` to use Resend

### 3.4 Deploy Functions

```bash
firebase deploy --only functions
```

## Step 4: Deploy to GitHub Pages

### 4.1 Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit"
```

### 4.2 Create GitHub Repository

1. Go to GitHub and create a new repository named `PlantCarePlanner`
2. **Important**: Make it public if using free GitHub Pages
3. Don't initialize with README

### 4.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/PlantCarePlanner.git
git branch -M main
git push -u origin main
```

### 4.4 Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under "Source", select **GitHub Actions**
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 4.5 Update Base Path

Make sure `vite.config.js` has the correct base path:

```javascript
base: '/PlantCarePlanner/',
```

If your repository name is different, update accordingly.

## Step 5: Update Email Links

After deployment, update the email links in `functions/index.js`:

```javascript
href="https://YOUR_USERNAME.github.io/PlantCarePlanner/calendar"
```

## Step 6: Test the Application

1. Visit `https://YOUR_USERNAME.github.io/PlantCarePlanner`
2. Sign in with Google
3. Add a plant from the database
4. Check your calendar for scheduled tasks
5. Test email notifications (may take up to 24 hours for daily digest)

## Troubleshooting

### Firebase Auth Issues
- Make sure Google provider is enabled
- Check authorized domains in Firebase Console
- Verify Firebase config is correct

### Firestore Permission Errors
- Check security rules
- Ensure user is authenticated

### Email Not Sending
- Verify email credentials in Firebase Functions config
- Check Firebase Functions logs: `firebase functions:log`
- Ensure functions are deployed: `firebase deploy --only functions`

### GitHub Pages 404
- Verify base path in `vite.config.js` matches repository name
- Check GitHub Actions workflow is running
- Ensure `dist` folder is being published

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

