// User API for handling user-related operations
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class UserAPI {
  // Get user profile by ID or email
  async getUserProfile(identifier) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/${identifier}`, {
        method: 'GET',
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
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Get user profile from SSO token
  async getSSOUserProfile(provider, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sso/${provider}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          provider,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching SSO user profile:', error);
      throw error;
    }
  }

  // Create or update SSO user profile
  async createOrUpdateSSOUser(ssoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sso/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: ssoData.provider,
          providerId: ssoData.providerId,
          email: ssoData.email,
          name: ssoData.name,
          avatar: ssoData.avatar,
          token: ssoData.token
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating/updating SSO user:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
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

  // Validate SSO token
  async validateSSOToken(provider, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sso/${provider}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validating SSO token:', error);
      throw error;
    }
  }

  // Refresh SSO token
  async refreshSSOToken(provider, refreshToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sso/${provider}/refresh`, {
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
      console.error('Error refreshing SSO token:', error);
      throw error;
    }
  }
}

// Export singleton instance
const userAPI = new UserAPI();
export default userAPI;
