# OAuth SSO Setup Guide

## Overview
This guide will help you set up direct OAuth authentication with Google, Facebook, and GitHub without using Firebase.

## Prerequisites
- Google Cloud Console account (for Google OAuth)
- Facebook Developer account (for Facebook OAuth)
- GitHub account (for GitHub OAuth)

## Step 1: Google OAuth Setup

### 1.1 Create Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth client ID"
5. Select "Web application"
6. Add authorized redirect URI: `http://localhost:3000/auth/google/callback` (for development)
7. For production, add: `https://yourdomain.com/auth/google/callback`
8. Copy Client ID and Client Secret

### 1.2 Enable Required APIs
1. Go to "APIs & Services" → "Library"
2. Enable "Google+ API" or "People API" for user profile access
3. Enable "OAuth2 API" for authentication

## Step 2: Facebook OAuth Setup

### 2.1 Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Add New App"
3. Choose "Business" or "None" (for personal projects)
4. Add "Facebook Login" product
5. In "Facebook Login" → "Settings", add your domain:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
6. Add redirect URI: `http://localhost:3000/auth/facebook/callback`
7. Copy App ID and App Secret

### 2.2 Configure Permissions
1. Go to "App Review" → "Permissions and Features"
2. Add "email" and "public_profile" permissions
3. Submit for review if needed (for production)

## Step 3: GitHub OAuth Setup

### 3.1 Create GitHub OAuth App
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: Your app name
   - Homepage URL: `http://localhost:3000` (development) or `https://yourdomain.com` (production)
   - Authorization callback URL: `http://localhost:3000/auth/github/callback`
4. Click "Register application"
5. Copy Client ID and generate Client Secret

## Step 4: Configure Environment Variables

Update your `.env` file with the OAuth credentials:

```env
# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Facebook OAuth
REACT_APP_FACEBOOK_CLIENT_ID=your_facebook_client_id_here
REACT_APP_FACEBOOK_CLIENT_SECRET=your_facebook_client_secret_here

# GitHub OAuth
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id_here
REACT_APP_GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

## Step 5: Redirect URIs Configuration

Make sure your OAuth apps have these exact redirect URIs:

### Development:
- Google: `http://localhost:3000/auth/google/callback`
- Facebook: `http://localhost:3000/auth/facebook/callback`
- GitHub: `http://localhost:3000/auth/github/callback`

### Production:
- Google: `https://yourdomain.com/auth/google/callback`
- Facebook: `https://yourdomain.com/auth/facebook/callback`
- GitHub: `https://yourdomain.com/auth/github/callback`

## Step 6: Test the Setup

1. Start your React app: `npm start`
2. Go to `http://localhost:3000`
3. Click "Continue with Google"
4. You should see the Google OAuth popup
5. Sign in with your Google account
6. You should be redirected back to your app with user data

## Expected Behavior

### Successful OAuth Flow:
1. **User clicks "Continue with Google"**
2. **OAuth popup opens** → `accounts.google.com`
3. **User signs in** and grants permission
4. **Popup closes** and user data is returned
5. **User is logged in** with real profile data

### User Data Retrieved:
```javascript
{
  id: "google_user_id",
  email: "user@gmail.com",
  name: "John Doe",
  avatar: "https://lh3.googleusercontent.com/...",
  provider: "google",
  emailVerified: true
}
```

## Troubleshooting

### Common Issues:

#### 1. "Popup blocked" Error
**Solution**: Allow popups for your site in browser settings

#### 2. "redirect_uri_mismatch" Error
**Solution**: Ensure redirect URIs in OAuth apps exactly match your app's URL

#### 3. "invalid_client" Error
**Solution**: Check that Client ID and Client Secret are correct

#### 4. "access_denied" Error
**Solution**: User denied access, try again

#### 5. No email returned
**Solution**: 
- Google: Ensure People API is enabled
- Facebook: Ensure email permission is requested
- GitHub: Ensure user has public email

## Security Considerations

### 1. Client Secret Security
- Never expose client secrets in frontend code
- Consider using a backend proxy for token exchange
- Use environment variables for secrets

### 2. State Parameter
- The app uses random state parameters to prevent CSRF attacks
- State is validated during OAuth callback

### 3. Token Storage
- Access tokens are stored in localStorage (consider security implications)
- Implement token refresh if needed

### 4. HTTPS in Production
- Always use HTTPS in production
- Update redirect URIs to use HTTPS

## Advanced Configuration

### 1. Custom Scopes
You can customize OAuth scopes in `OAuthService.js`:

```javascript
// For Google
scope: 'openid email profile https://www.googleapis.com/auth/userinfo.profile'

// For Facebook
scope: 'email,public_profile,user_friends'

// For GitHub
scope: 'user:email user:profile repo'
```

### 2. Additional Providers
Add new OAuth providers by extending the `providers` object in `OAuthService.js`:

```javascript
microsoft: {
  authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID,
  redirectUri: `${window.location.origin}/auth/microsoft/callback`,
  scope: 'openid email profile',
  responseType: 'code'
}
```

### 3. Backend Integration
For production, consider implementing a backend to:
- Handle token exchange securely
- Store tokens securely
- Implement refresh token logic
- Provide additional user data

## Production Deployment

### 1. Update OAuth Apps
- Change redirect URIs to production domain
- Update app URLs and descriptions
- Test production OAuth flow

### 2. Environment Variables
- Use production OAuth credentials
- Ensure no development credentials in production build

### 3. Domain Configuration
- Add production domain to all OAuth apps
- Configure HTTPS certificates
- Update CORS settings if needed

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify OAuth app configurations
3. Ensure redirect URIs match exactly
4. Check environment variables are set correctly
5. Review OAuth provider documentation

## Next Steps

Once OAuth is properly configured:
1. ✅ Real Google OAuth authentication
2. ✅ Real Facebook OAuth authentication
3. ✅ Real GitHub OAuth authentication
4. ✅ Direct OAuth without Firebase dependency
5. ✅ Customizable OAuth scopes and permissions
6. ✅ Production-ready OAuth implementation
