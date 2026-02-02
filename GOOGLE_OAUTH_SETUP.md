# Google OAuth Setup Guide

Follow these steps to set up real Google OAuth authentication for your React application.

## 📋 Prerequisites

- Google account (Gmail or Google Workspace)
- Google Cloud Console access
- Your React application running on `http://localhost:3000`

## 🚀 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click the project dropdown at the top
   - Click "NEW PROJECT"
   - Enter project name: `React Login App`
   - Click "CREATE"

3. **Select Your Project**
   - Wait for project creation (takes 30 seconds)
   - Select your new project from the dropdown

### Step 2: Enable Required APIs

1. **Go to API Library**
   - In the left menu, go to "APIs & Services" → "Library"

2. **Enable Google+ API** (Optional - for basic profile info)
   - Search for "Google+ API"
   - Click on it and click "ENABLE"
   - Note: This API is deprecated but still works for basic info

3. **Enable People API** (Recommended - for user profile data)
   - Search for "People API"
   - Click on it and click "ENABLE"
   - This provides user profile information

4. **Enable Google Identity Toolkit API** (Optional - for advanced auth)
   - Search for "Google Identity Toolkit API"
   - Click on it and click "ENABLE"

**Note**: For basic OAuth authentication, you actually don't need to enable any additional APIs. OAuth 2.0 authentication works with just the OAuth client ID setup. The APIs above are only needed if you want to access additional Google services beyond basic user profile information.

### Step 3: Create OAuth 2.0 Credentials

1. **Go to Credentials**
   - In the left menu, go to "APIs & Services" → "Credentials"

2. **Create OAuth Client ID**
   - Click "+ CREATE CREDENTIALS"
   - Select "OAuth client ID"

3. **Configure OAuth Consent Screen**
   - If prompted, click "CONFIGURE CONSENT SCREEN"
   - Choose "External" and click "CREATE"
   - Fill in:
     - **App name**: `React Login App`
     - **User support email**: Your email
     - **Developer contact information**: Your email
   - Click "SAVE AND CONTINUE" through all steps
   - Click "BACK TO DASHBOARD"

4. **Create OAuth Client ID**
   - Go back to "Credentials" → "+ CREATE CREDENTIALS" → "OAuth client ID"
   - **Application type**: `Web application`
   - **Name**: `React Login App Web Client`
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: 
     - Click "+ ADD URI"
     - Enter: `http://localhost:3000/auth/google/callback`
   - Click "CREATE"

### Step 4: Get Your Credentials

1. **Copy Client ID**
   - After creation, you'll see a popup with your credentials
   - Copy the **Client ID** (looks like: `461015503172-tcectlmrgch6vu2ion296fioag2oaulu.apps.googleusercontent.com`)

2. **Copy Client Secret**
   - Click "DOWNLOAD JSON" or copy the **Client Secret**
   - Keep this secret - don't share it!

### Step 5: Update Your .env File

1. **Open `.env` file** in your React project root
2. **Replace with your real credentials**:

```env
# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=your_real_client_id_here
REACT_APP_GOOGLE_CLIENT_SECRET=your_real_client_secret_here

# API Configuration
REACT_APP_API_URL=http://localhost:3001/api
```

3. **Replace the placeholders**:
   - `your_real_client_id_here` → Your actual Client ID
   - `your_real_client_secret_here` → Your actual Client Secret

### Step 6: Restart Your React App

1. **Stop your current app** (if running)
2. **Restart with fresh environment variables**:

```bash
npm start
# or
yarn start
```

## 🧪 Test Your Setup

### Step 1: Try Google Login

1. **Open your app** at `http://localhost:3000`
2. **Click "Continue with Google"**
3. **You should see**:
   - Google OAuth consent screen
   - Your app name and logo
   - Permission requests (email, profile)

### Step 2: Complete Authentication

1. **Sign in** with your Google account
2. **Click "Allow"** to grant permissions
3. **You should be redirected** back to your app
4. **Check the console** for success messages

## 🔍 Troubleshooting

### Error: "invalid_client"

**Cause**: Wrong Client ID or Client Secret
**Solution**: 
- Double-check your .env file
- Ensure no extra spaces or quotes
- Restart your app after updating .env

### Error: "redirect_uri_mismatch"

**Cause**: Redirect URI doesn't match what's configured in Google Cloud
**Solution**:
- Go to Google Cloud Console → Credentials → Your OAuth Client
- Verify redirect URI is exactly: `http://localhost:3000/auth/google/callback`
- No trailing slashes, exact match

### Error: "access_denied"

**Cause**: User denied permission or app not verified
**Solution**:
- Try again and click "Allow"
- For production, you'll need to verify your app with Google

### Error: "API not enabled" (if you enabled additional APIs)

**Cause**: Trying to access Google APIs that aren't enabled
**Solution**:
- Enable the required APIs (People API, etc.)
- Or stick to basic OAuth which doesn't need additional APIs

### Error: No redirect after authentication

**Cause**: OAuth callback handling issue
**Solution**:
- Check browser console for errors
- Verify your app is running on port 3000
- Check that OAuthService.js is properly loaded

## 🛡️ Security Notes

### Development vs Production

**Development**:
- Use `http://localhost:3000` as redirect URI
- Test with your own Google account
- App doesn't need to be verified

**Production**:
- Use your actual domain (e.g., `https://yourapp.com/auth/google/callback`)
- Add production domain to authorized JavaScript origins
- App must be verified by Google for public use

### Best Practices

1. **Keep Client Secret secure** - Never commit to git
2. **Use environment variables** - Don't hardcode credentials
3. **Limit API scopes** - Only request what you need
4. **Validate tokens** - Always verify tokens on server-side in production

## 📱 Production Deployment

When deploying to production:

1. **Update redirect URI** to your production domain
2. **Add production domain** to authorized JavaScript origins
3. **Verify your app** with Google (required for public apps)
4. **Use HTTPS** (required for production OAuth)
5. **Consider server-side token validation**

## 🎯 Success Indicators

You'll know it's working when you see:

1. ✅ Google OAuth consent screen appears
2. ✅ No "invalid_client" or "redirect_uri_mismatch" errors
3. ✅ Successful redirect back to your app
4. ✅ User data appears in console logs
5. ✅ User is logged into your dashboard

## 🆘 Need Help?

If you encounter issues:

1. **Check console logs** for detailed error messages
2. **Verify redirect URI** matches exactly
3. **Ensure app is running** on localhost:3000
4. **Double-check .env file** for correct credentials
5. **Restart your app** after any changes

---

**🎉 Once complete, you'll have working Google OAuth authentication with PKCE security!**
