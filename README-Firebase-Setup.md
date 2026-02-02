# Firebase SSO Setup Guide

## Overview
This guide will help you set up Firebase SSO authentication to enable real Google, Facebook, and GitHub login instead of the static email selection modal.

## Prerequisites
- A Firebase project (create one at [Firebase Console](https://console.firebase.google.com/))
- Google Account (for Google SSO)
- Facebook Developer Account (for Facebook SSO)
- GitHub Account (for GitHub SSO)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "my-auth-app")
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" → "Sign-in method"
2. Enable the providers you want to use:

### Google Setup:
1. Click "Google" → Enable
2. Choose a project support email
3. Click "Save"

### Facebook Setup:
1. Click "Facebook" → Enable
2. Go to [Facebook Developers](https://developers.facebook.com/)
3. Create a new app or use existing one
4. Add "Facebook Login" product
5. Copy "App ID" and "App Secret"
6. Add your Firebase OAuth redirect URI: `https://your-project-id.firebaseapp.com/__/auth/handler`
7. Paste credentials in Firebase and click "Save"

### GitHub Setup:
1. Click "GitHub" → Enable
2. Go to GitHub Settings → Developer settings → OAuth Apps
3. Click "New OAuth App"
4. Fill in:
   - Application name: Your app name
   - Homepage URL: `http://localhost:3000` (for development)
   - Authorization callback URL: `https://your-project-id.firebaseapp.com/__/auth/handler`
5. Copy Client ID and Client Secret
6. Paste in Firebase and click "Save"

## Step 3: Configure Your App

1. In Firebase Console → Project Settings → General
2. Scroll down to "Your apps" section
3. Click Web app (</>) icon
4. Enter app name and click "Register app"
5. Copy the Firebase configuration

## Step 4: Update Environment Variables

Create/update your `.env` file with real Firebase credentials:

```env
# Replace with your actual Firebase credentials
REACT_APP_FIREBASE_API_KEY=your_real_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Step 5: Add Authorized Domains

1. In Firebase Console → Authentication → Settings
2. Under "Authorized domains", add:
   - `localhost` (for development)
   - `127.0.0.1` (for development)
   - Your production domain (e.g., `yourdomain.com`)

## Step 6: Update Firebase Configuration

Update `src/firebase.js` to include your actual domain:

```javascript
const authorizedDomains = [
  'localhost',
  '127.0.0.1',
  'your-project.firebaseapp.com', // Your actual Firebase domain
  'yourdomain.com', // Your production domain
];
```

## Step 7: Test the Setup

1. Start your React app: `npm start`
2. Open browser to `http://localhost:3000`
3. Click "Continue with Google"
4. You should see the Google OAuth popup
5. Sign in with your Google account
6. You should be redirected back to your app with user data

## Expected Behavior

### Before Firebase Setup:
- Clicking SSO buttons → Shows email selection modal
- Static email options with mock authentication

### After Firebase Setup:
- Clicking "Continue with Google" → Opens Google OAuth popup
- User sees: "Choose an account" with their Google accounts
- User selects account → Authenticates → Returns to app
- Real user data (name, email, profile picture) is displayed

## Troubleshooting

### Popup Blocked Error:
```
"auth/popup-blocked" or "auth/popup-closed-by-user"
```
**Solution**: Allow popups for your site in browser settings

### Domain Not Authorized Error:
```
"Domain is not authorized for Firebase authentication"
```
**Solution**: Add your domain to Firebase authorized domains list

### API Key Not Allowed Error:
```
"auth/api-key-not-allowed"
```
**Solution**: Ensure you're using the correct API key from Firebase Console

### Configuration Error:
```
"Firebase is not configured"
```
**Solution**: Check your `.env` file has correct Firebase credentials

## Development vs Production

### Development (localhost):
- Uses `localhost` and `127.0.0.1` domains
- Test with local Firebase project
- Works immediately after setup

### Production:
- Add your production domain to Firebase authorized domains
- Update `.env` with production Firebase config
- Deploy and test with real domain

## Security Considerations

1. **Never commit `.env` file** to version control
2. **Use different Firebase projects** for development and production
3. **Restrict authorized domains** to only your actual domains
4. **Enable email verification** in Firebase Authentication settings
5. **Monitor Firebase Authentication** usage in console

## Next Steps

Once Firebase is properly configured:

1. ✅ Real Google OAuth authentication
2. ✅ Real Facebook OAuth authentication  
3. ✅ Real GitHub OAuth authentication
4. ✅ Actual user profile data
5. ✅ Secure token-based authentication
6. ✅ Email verification (if enabled)

The email selection modal will only appear as a fallback when Firebase is not configured or when there are authentication errors.
