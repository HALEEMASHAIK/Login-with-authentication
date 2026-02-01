// Authentication API for handling SSO and authentication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class AuthAPI {
  // Authenticate with SSO provider
  async authenticateWithSSO(provider, token, userInfo = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sso/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          provider,
          userInfo,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('SSO authentication error:', error);
      throw error;
    }
  }

  // Complete SSO login flow
  async completeSSOLogin(provider, ssoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sso/${provider}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId: ssoData.providerId,
          email: ssoData.email,
          name: ssoData.name,
          avatar: ssoData.avatar,
          accessToken: ssoData.accessToken,
          refreshToken: ssoData.refreshToken,
          expiresIn: ssoData.expiresIn
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('SSO login completion error:', error);
      throw error;
    }
  }

  // Get SSO authorization URL
  getSSOAuthorizationUrl(provider, redirectUri) {
    const baseUrl = {
      google: 'https://accounts.google.com/oauth/authorize',
      facebook: 'https://www.facebook.com/v18.0/dialog/oauth',
      github: 'https://github.com/login/oauth/authorize'
    };

    const params = new URLSearchParams({
      client_id: process.env[`REACT_APP_${provider.toUpperCase()}_CLIENT_ID`],
      redirect_uri: redirectUri || `${window.location.origin}/auth/callback`,
      response_type: 'code',
      scope: this.getSSOScope(provider),
      state: this.generateSSOState()
    });

    return `${baseUrl[provider]}?${params.toString()}`;
  }

  // Get SSO scope for each provider
  getSSOScope(provider) {
    const scopes = {
      google: 'openid email profile',
      facebook: 'email public_profile',
      github: 'user:email'
    };
    return scopes[provider] || 'email';
  }

  // Generate SSO state for security
  generateSSOState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Exchange SSO code for tokens
  async exchangeSSOCode(provider, code, redirectUri) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sso/${provider}/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirect_uri: redirectUri || `${window.location.origin}/auth/callback`,
          client_id: process.env[`REACT_APP_${provider.toUpperCase()}_CLIENT_ID`],
          client_secret: process.env[`REACT_APP_${provider.toUpperCase()}_CLIENT_SECRET`]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('SSO code exchange error:', error);
      throw error;
    }
  }

  // Login with email and password
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get authentication token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  // Store authentication token
  setAuthToken(token, rememberMe = false) {
    if (rememberMe) {
      localStorage.setItem('authToken', token);
    } else {
      sessionStorage.setItem('authToken', token);
    }
  }

  // Clear authentication token
  clearAuthToken() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  }

  // Refresh authentication token
  async refreshToken(refreshToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }
}

// Export singleton instance
const authAPI = new AuthAPI();
export default authAPI;
