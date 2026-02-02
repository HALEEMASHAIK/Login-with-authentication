// OAuth SSO Service - OAuth 2.0 Authorization Code Flow with PKCE
class OAuthService {
  constructor() {
    // OAuth configuration
    this.config = {
      google: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
        redirectUri: `${window.location.origin}/auth/google/callback`,
        scopes: ['openid', 'profile', 'email'],
        responseType: 'code'
      }
    };
  }

  // Generate cryptographically secure random string for PKCE
  generateRandomString(length) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Base64 URL encode for PKCE (RFC 4648)
  base64UrlEncode(arrayBuffer) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  // Generate PKCE verifier and challenge
  async generatePKCE() {
    const codeVerifier = this.generateRandomString(128);
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const codeChallenge = this.base64UrlEncode(digest);
    
    return { codeVerifier, codeChallenge };
  }

  // Store PKCE verifier in sessionStorage
  storePKCEVerifier(providerId, codeVerifier) {
    sessionStorage.setItem(`pkce_verifier_${providerId}`, codeVerifier);
  }

  // Retrieve PKCE verifier from sessionStorage
  getPKCEVerifier(providerId) {
    return sessionStorage.getItem(`pkce_verifier_${providerId}`);
  }

  // Clear PKCE verifier
  clearPKCEVerifier(providerId) {
    sessionStorage.removeItem(`pkce_verifier_${providerId}`);
  }

  // Generate secure state parameter for CSRF protection
  generateState() {
    return this.generateRandomString(32);
  }

  // Store state in sessionStorage
  storeState(providerId, state) {
    sessionStorage.setItem(`oauth_state_${providerId}`, state);
  }

  // Retrieve and verify state
  getStoredState(providerId) {
    return sessionStorage.getItem(`oauth_state_${providerId}`);
  }

  // Clear state
  clearState(providerId) {
    sessionStorage.removeItem(`oauth_state_${providerId}`);
  }

  // Check if provider is configured
  isProviderConfigured(providerId) {
    const config = this.config[providerId];
    return config && config.clientId && 
           config.clientId !== 'your_google_client_id_here' &&
           config.clientId !== '123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com';
  }

  // Get configured providers
  getConfiguredProviders() {
    return Object.keys(this.config)
      .filter(providerId => this.isProviderConfigured(providerId))
      .map(providerId => ({
        id: providerId,
        name: providerId.charAt(0).toUpperCase() + providerId.slice(1),
        clientId: this.config[providerId].clientId,
        configured: true
      }));
  }

  // Initiate OAuth 2.0 Authorization Code Flow with PKCE
  async initiateOAuthRedirect(providerId) {
    try {
      const config = this.config[providerId];
      if (!config) {
        throw new Error(`Provider ${providerId} not configured`);
      }

      console.log(`🚀 Initiating OAuth 2.0 with PKCE for ${providerId}...`);

      // Generate PKCE verifier and challenge
      const { codeVerifier, codeChallenge } = await this.generatePKCE();
      
      // Generate state for CSRF protection
      const state = this.generateState();
      
      // Store PKCE verifier and state
      this.storePKCEVerifier(providerId, codeVerifier);
      this.storeState(providerId, state);

      // Build authorization URL with PKCE
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: config.responseType,
        scope: config.scopes.join(' '),
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        access_type: 'offline', // For refresh tokens
        prompt: 'consent' // Force consent screen for testing
      });

      const authUrl = `${config.authUrl}?${params.toString()}`;
      
      console.log(`🔗 Redirecting to ${providerId} OAuth with PKCE...`);
      console.log(`🔗 Auth URL: ${authUrl}`);
      
      // Redirect to OAuth provider
      window.location.href = authUrl;
      
    } catch (error) {
      console.error(`❌ OAuth initiation failed for ${providerId}:`, error);
      throw error;
    }
  }

  // Handle OAuth callback with PKCE
  async handleOAuthCallback(callbackUrl) {
    try {
      console.log('🔄 Handling OAuth callback with PKCE...');
      
      const url = new URL(callbackUrl);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      if (error) {
        throw new Error(`OAuth error: ${error}`);
      }

      if (!code || !state) {
        throw new Error('Missing authorization code or state in callback');
      }

      // Extract provider from URL path
      const pathname = url.pathname;
      let providerId = null;
      
      if (pathname.includes('/google/')) {
        providerId = 'google';
      } else {
        throw new Error('Unknown OAuth provider in callback URL');
      }

      // Verify state parameter
      const storedState = this.getStoredState(providerId);
      this.clearState(providerId);
      
      if (!storedState || state !== storedState) {
        throw new Error('Invalid state parameter - possible CSRF attack');
      }

      console.log(`✅ State verified for ${providerId}`);

      // Exchange authorization code for tokens using PKCE
      const tokens = await this.exchangeCodeForTokens(providerId, code);
      
      // Get user information
      const userInfo = await this.getUserInfo(providerId, tokens.access_token);
      
      // Clear PKCE verifier
      this.clearPKCEVerifier(providerId);

      // Format user data
      const userData = this.formatUserData(providerId, userInfo, tokens);
      
      console.log('✅ OAuth callback successful with PKCE:', userData);
      
      return userData;
      
    } catch (error) {
      console.error('❌ OAuth callback error:', error);
      throw error;
    }
  }

  // Exchange authorization code for tokens using PKCE
  async exchangeCodeForTokens(providerId, code) {
    try {
      const config = this.config[providerId];
      const codeVerifier = this.getPKCEVerifier(providerId);
      
      if (!codeVerifier) {
        throw new Error('PKCE verifier not found');
      }

      console.log(`🔄 Exchanging code for tokens with PKCE for ${providerId}...`);

      const tokenData = {
        grant_type: 'authorization_code',
        client_id: config.clientId,
        code,
        redirect_uri: config.redirectUri,
        code_verifier: codeVerifier
      };

      // For Google, we can include client secret if available
      if (config.clientSecret && config.clientSecret !== 'your_google_client_secret_here') {
        tokenData.client_secret = config.clientSecret;
      }

      const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(tokenData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token exchange error response:', errorText);
        throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
      }

      const tokens = await response.json();
      console.log('✅ Token exchange successful with PKCE');
      
      return tokens;
      
    } catch (error) {
      console.error(`❌ Token exchange failed for ${providerId}:`, error);
      throw error;
    }
  }

  // Get user information from provider
  async getUserInfo(providerId, accessToken) {
    try {
      const config = this.config[providerId];
      
      console.log(`🔄 Fetching user info from ${providerId}...`);

      const response = await fetch(config.userInfoUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.status}`);
      }

      const userInfo = await response.json();
      console.log('✅ User info retrieved:', userInfo);
      
      return userInfo;
      
    } catch (error) {
      console.error(`❌ Failed to get user info from ${providerId}:`, error);
      throw error;
    }
  }

  // Format user data consistently
  formatUserData(providerId, userInfo, tokens) {
    const formattedData = {
      id: userInfo.id || userInfo.sub,
      email: userInfo.email,
      name: userInfo.name || userInfo.displayName,
      avatar: userInfo.picture || userInfo.avatar_url,
      provider: providerId,
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        token_type: tokens.token_type
      },
      emailVerified: userInfo.verified_email || userInfo.email_verified || false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    // Add provider-specific data
    if (providerId === 'google') {
      formattedData.providerId = `google_${userInfo.id}`;
      formattedData.locale = userInfo.locale;
      formattedData.hd = userInfo.hd; // G Suite domain
    }

    return formattedData;
  }

  // Store user data in localStorage
  storeUserData(userData) {
    try {
      localStorage.setItem('ssoUser', JSON.stringify(userData));
      localStorage.setItem('ssoProvider', userData.provider);
      localStorage.setItem('ssoTokens', JSON.stringify(userData.tokens));
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  }

  // Get stored user data
  getStoredUserData() {
    try {
      const userData = localStorage.getItem('ssoUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to retrieve stored user data:', error);
      return null;
    }
  }

  // Clear stored user data
  clearStoredUserData() {
    try {
      localStorage.removeItem('ssoUser');
      localStorage.removeItem('ssoProvider');
      localStorage.removeItem('ssoTokens');
    } catch (error) {
      console.error('Failed to clear stored user data:', error);
    }
  }

  // Refresh access token if available
  async refreshAccessToken(providerId) {
    try {
      const tokens = JSON.parse(localStorage.getItem('ssoTokens') || '{}');
      
      if (!tokens.refresh_token) {
        throw new Error('No refresh token available');
      }

      const config = this.config[providerId];
      
      const refreshData = {
        grant_type: 'refresh_token',
        client_id: config.clientId,
        refresh_token: tokens.refresh_token
      };

      if (config.clientSecret && config.clientSecret !== 'your_google_client_secret_here') {
        refreshData.client_secret = config.clientSecret;
      }

      const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(refreshData)
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const newTokens = await response.json();
      
      // Update stored tokens
      const userData = this.getStoredUserData();
      if (userData) {
        userData.tokens = {
          ...userData.tokens,
          access_token: newTokens.access_token,
          expires_in: newTokens.expires_in
        };
        this.storeUserData(userData);
      }

      return newTokens.access_token;
      
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }
}

export default new OAuthService();
