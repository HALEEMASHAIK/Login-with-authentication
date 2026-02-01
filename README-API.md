# API Documentation

## Overview
This application includes a comprehensive API layer for handling user authentication and profile management. The API is designed to work with both real backend services and mock data for development.

## API Structure

### 1. User API (`src/api/userApi.js`)
Handles user-related operations including profile management and SSO user operations.

#### Methods:
- `getUserProfile(identifier)` - Get user profile by ID or email
- `getSSOUserProfile(provider, token)` - Get user profile from SSO token
- `createOrUpdateSSOUser(ssoData)` - Create or update SSO user profile
- `updateUserProfile(userId, profileData)` - Update user profile
- `validateSSOToken(provider, token)` - Validate SSO token
- `refreshSSOToken(provider, refreshToken)` - Refresh SSO token
- Token management methods (get/set/clear auth tokens)

#### Example Usage:
```javascript
import userAPI from './api/userApi';

// Get SSO user profile
const ssoProfile = await userAPI.getSSOUserProfile('google', 'sso-token');

// Create/update SSO user
const ssoUser = await userAPI.createOrUpdateSSOUser({
  provider: 'google',
  providerId: 'google_123456',
  email: 'user@gmail.com',
  name: 'John Doe',
  avatar: 'https://example.com/avatar.jpg'
});
```

### 2. Auth API (`src/api/authApi.js`)
Handles authentication operations including SSO and traditional login.

#### Methods:
- `authenticateWithSSO(provider, token, userInfo)` - Authenticate with SSO provider
- `completeSSOLogin(provider, ssoData)` - Complete SSO login flow
- `getSSOAuthorizationUrl(provider, redirectUri)` - Get SSO authorization URL
- `exchangeSSOCode(provider, code, redirectUri)` - Exchange SSO code for tokens
- `login(email, password)` - Traditional email/password login
- `register(userData)` - Register new user
- `logout()` - Logout user
- `refreshToken(refreshToken)` - Refresh authentication token
- Token management methods

#### Example Usage:
```javascript
import authAPI from './api/authApi';

// Get SSO authorization URL
const authUrl = authAPI.getSSOAuthorizationUrl('google', 'http://localhost:3000/callback');

// Complete SSO login
const ssoResult = await authAPI.completeSSOLogin('google', {
  providerId: 'google_123456',
  email: 'user@gmail.com',
  name: 'John Doe',
  accessToken: 'access-token',
  refreshToken: 'refresh-token'
});
```

## SSO Login Flow

### 1. Initiate SSO Login
```javascript
// Get authorization URL
const authUrl = authAPI.getSSOAuthorizationUrl('google');
// Redirect user to authUrl
```

### 2. Handle SSO Callback
```javascript
// Exchange authorization code for tokens
const tokenData = await authAPI.exchangeSSOCode('google', code, redirectUri);

// Complete SSO login
const userProfile = await authAPI.completeSSOLogin('google', {
  providerId: tokenData.providerId,
  email: tokenData.email,
  name: tokenData.name,
  accessToken: tokenData.accessToken,
  refreshToken: tokenData.refreshToken
});
```

### 3. Store User Data
```javascript
// Create/update SSO user in database
const user = await userAPI.createOrUpdateSSOUser({
  provider: 'google',
  providerId: userProfile.providerId,
  email: userProfile.email,
  name: userProfile.name,
  avatar: userProfile.avatar
});

// Store authentication token
authAPI.setAuthToken(user.token, true);
```

## API Endpoints

### SSO Authentication Endpoints:
- `POST /api/auth/sso/{provider}` - SSO authentication
- `POST /api/auth/sso/{provider}/complete` - Complete SSO login
- `POST /api/auth/sso/{provider}/exchange` - Exchange SSO code
- `POST /api/auth/sso/{provider}/profile` - Get SSO user profile
- `POST /api/auth/sso/{provider}/validate` - Validate SSO token
- `POST /api/auth/sso/{provider}/refresh` - Refresh SSO token

### User Profile Endpoints:
- `GET /api/users/profile/{identifier}` - Get user profile
- `POST /api/auth/sso/user` - Create/update SSO user
- `PUT /api/users/{userId}` - Update user profile

### Traditional Auth Endpoints:
- `POST /api/auth/login` - Traditional login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

## Response Format

### SSO User Profile Response:
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "providerId": "google_123456",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "provider": "google",
    "token": "jwt-token-here",
    "accessToken": "google-access-token",
    "refreshToken": "google-refresh-token",
    "expiresIn": 3600,
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLogin": "2024-01-01T12:00:00Z"
  }
}
```

### SSO Authentication Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "tokens": {
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token",
      "expiresIn": 3600
    }
  }
}
```

## Environment Variables

Create a `.env` file in your project root:

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_GOOGLE_CLIENT_SECRET=your-google-client-secret
REACT_APP_FACEBOOK_CLIENT_ID=your-facebook-client-id
REACT_APP_FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
REACT_APP_GITHUB_CLIENT_ID=your-github-client-id
REACT_APP_GITHUB_CLIENT_SECRET=your-github-client-secret
```

## SSO Provider Configuration

### Google SSO:
- **Authorization URL**: `https://accounts.google.com/oauth/authorize`
- **Scope**: `openid email profile`
- **Response Type**: `code`

### Facebook SSO:
- **Authorization URL**: `https://www.facebook.com/v18.0/dialog/oauth`
- **Scope**: `email public_profile`
- **Response Type**: `code`

### GitHub SSO:
- **Authorization URL**: `https://github.com/login/oauth/authorize`
- **Scope**: `user:email`
- **Response Type**: `code`

## Mock SSO Data Structure

When the API is not available, the application falls back to mock SSO data:

```javascript
{
  id: "generated-id",
  providerId: "google_" + Date.now(),
  name: "User Name",
  email: "user@example.com",
  avatar: "https://ui-avatars.com/api/?name=username&background=667eea&color=fff",
  provider: "google",
  token: "mock-jwt-token-" + Date.now(),
  accessToken: "mock-access-token-" + Date.now(),
  refreshToken: "mock-refresh-token-" + Date.now(),
  expiresIn: 3600,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString()
}
```

## Integration in Components

### App.js SSO Integration:
```javascript
import userAPI from './api/userApi';
import authAPI from './api/authApi';

// SSO login with API
const handleSSO = async (email) => {
  try {
    // Get SSO user profile
    const userProfile = await userAPI.getSSOUserProfile('google', 'sso-token');
    
    // Create/update SSO user if needed
    if (!userProfile || userProfile.error) {
      const ssoData = {
        provider: 'google',
        providerId: 'google_' + Date.now(),
        email: email,
        name: 'User Name',
        avatar: 'avatar-url'
      };
      const createdUser = await userAPI.createOrUpdateSSOUser(ssoData);
      setCurrentUser(createdUser);
    } else {
      setCurrentUser(userProfile);
    }
    
    // Store auth token
    authAPI.setAuthToken(userProfile.token, true);
  } catch (error) {
    // Handle error or fallback to mock data
  }
};
```

## Error Handling

All SSO API methods include comprehensive error handling:
- Network errors
- Authentication errors
- Token validation errors
- Provider-specific errors

The application gracefully falls back to mock SSO data when the API is unavailable, ensuring uninterrupted functionality during development.

## Security Features

- JWT token management for SSO
- Secure token storage (localStorage/sessionStorage)
- Automatic token clearing on logout
- Provider-specific authentication flows
- SSO state generation for CSRF protection
- Token refresh mechanisms
- Request/response interceptors for security headers

## Development Notes

- The SSO API layer supports multiple providers (Google, Facebook, GitHub)
- Mock SSO data provides realistic user information for testing
- All SSO API calls are asynchronous and return promises
- Error handling includes user-friendly messages
- Token management supports both persistent and session-based storage
- SSO flow includes proper state management and security measures
