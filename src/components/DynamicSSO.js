import React, { useState, useEffect } from 'react';
import SSOEmailModal from './SSOEmailModal';
import OAuthService from '../sso/OAuthService';
import './DynamicSSO.css';

function DynamicSSO({ onSSO, buttonText = "Continue with" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loadingEmail, setLoadingEmail] = useState(null);
  const [ssoProviders, setSsoProviders] = useState([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  // Initialize SSO providers dynamically
  useEffect(() => {
    const initializeProviders = async () => {
      try {
        setIsLoadingProviders(true);
        
        // Load providers from OAuth service
        const configuredProviders = await loadProvidersFromConfig();
        setSsoProviders(configuredProviders);
        
      } catch (error) {
        console.error('Failed to load SSO providers:', error);
        // Set empty array if no providers available
        setSsoProviders([]);
      } finally {
        setIsLoadingProviders(false);
      }
    };

    initializeProviders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load providers from configuration
  const loadProvidersFromConfig = async () => {
    try {
      // For now, return Google as the only provider
      const providers = [
        {
          id: 'google',
          name: 'Google',
          clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          configured: true,
          icon: getProviderIcon('google'),
          scopes: []
        }
      ];
      
      return providers;
    } catch (error) {
      console.warn('Failed to load providers:', error);
      return [];
    }
  };

  // Get provider icon based on provider ID
  const getProviderIcon = (providerId) => {
    switch (providerId) {
      case 'google':
        return (
          <svg className="sso-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg className="sso-icon" viewBox="0 0 24 24">
            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'github':
        return (
          <svg className="sso-icon" viewBox="0 0 24 24">
            <path fill="#333" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        );
      case 'microsoft':
        return (
          <svg className="sso-icon" viewBox="0 0 24 24">
            <rect fill="#f25022" x="0" y="0" width="11" height="11"/>
            <rect fill="#00a4ef" x="13" y="0" width="11" height="11"/>
            <rect fill="#7fba00" x="0" y="13" width="11" height="11"/>
            <rect fill="#ffb900" x="13" y="13" width="11" height="11"/>
          </svg>
        );
      case 'okta':
        return (
          <svg className="sso-icon" viewBox="0 0 24 24">
            <circle fill="#007dc3" cx="12" cy="12" r="10"/>
            <text fill="white" x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold">OK</text>
          </svg>
        );
      default:
        return (
          <svg className="sso-icon" viewBox="0 0 24 24">
            <circle fill="#667eea" cx="12" cy="12" r="10"/>
            <text fill="white" x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold">SSO</text>
          </svg>
        );
    }
  };

  // Dynamic SSO login handler
  const handleSSOLogin = async (provider) => {
    setSelectedProvider(provider.id);
    
    try {
      console.log(`🚀 Initiating ${provider.id} SSO...`);
      
      // Check if provider is configured
      if (!provider.configured && !process.env.REACT_APP_GOOGLE_CLIENT_ID) {
        console.log('📧 Google OAuth not configured, showing setup message');
        alert(`To use Google SSO, please configure OAuth credentials.\n\nPlease follow these steps:\n1. Create a Google OAuth app\n2. Set GOOGLE_CLIENT_ID in your .env file\n3. Set GOOGLE_CLIENT_SECRET in your .env file\n4. Add redirect URI: ${window.location.origin}/auth/google/callback\n\nFor detailed instructions, see the OAuth setup guide.`);
        return;
      }
      
      // Initiate OAuth flow with redirect
      OAuthService.initiateOAuthRedirect(provider.id);
      
    } catch (error) {
      console.error(`${provider.id} SSO Error:`, error);
      
      // Check specific error types
      if (error.message.includes('not configured')) {
        alert(`${provider.name} SSO is not properly configured.\n\nPlease check:\n1. ${provider.id.toUpperCase()}_CLIENT_ID in .env file\n2. ${provider.id.toUpperCase()}_CLIENT_SECRET in .env file\n3. OAuth app settings and redirect URI\n\nSee the OAuth setup guide for detailed instructions.`);
        return;
      }
      
      // For other errors, show helpful message
      alert(`Failed to authenticate with ${provider.name}.\n\nError: ${error.message}\n\nPlease check your OAuth configuration and try again.`);
    }
  };

  // Dynamic user data formatting
  const formatUserData = (userData, provider) => {
    return {
      id: userData.id,
      providerId: `${provider.id}_${userData.id}`,
      email: userData.email,
      name: userData.name,
      avatar: userData.avatar,
      provider: provider.id,
      token: userData.tokens?.access_token || `oauth-token-${  Date.now()}`,
      emailVerified: userData.emailVerified || true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      providerInfo: {
        name: provider.name,
        clientId: provider.clientId
      }
    };
  };

  // Handle modal close
  const handleModalClose = () => {
    if (!loadingEmail) {
      setIsModalOpen(false);
      setSelectedProvider(null);
    }
  };

  // Handle email selection from modal
  const handleEmailSelect = async (selectedEmail) => {
    setLoadingEmail(selectedEmail);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user data for selected provider
      const provider = ssoProviders.find(p => p.id === selectedProvider);
      if (provider) {
        const userData = formatUserData({
          uid: `${provider.id}_${Date.now()}`,
          email: selectedEmail,
          displayName: selectedEmail.split('@')[0].charAt(0).toUpperCase() + selectedEmail.split('@')[0].slice(1),
          emailVerified: true
        }, provider);
        
        localStorage.setItem('ssoProvider', provider.id);
        localStorage.setItem('ssoData', JSON.stringify(userData));
        
        onSSO(selectedEmail);
        
        setTimeout(() => {
          setIsModalOpen(false);
          setSelectedProvider(null);
          setLoadingEmail(null);
        }, 100);
      }
    } catch (error) {
      console.error('Email selection error:', error);
      setLoadingEmail(null);
    }
  };

  if (isLoadingProviders) {
    return (
      <div className="dynamic-sso-loading">
        <div className="sso-loading-spinner"></div>
        <p>Loading authentication options...</p>
      </div>
    );
  }

  // Always show SSO buttons (even if not configured)
  return (
    <>
      <div className="dynamic-sso-container">
        <div className="sso-divider">
          <span>OR</span>
        </div>
        
        <div className="dynamic-sso-buttons">
          {ssoProviders.length > 0 ? (
            // Show configured providers
            ssoProviders.map((provider) => (
              <button
                key={provider.id}
                className={`dynamic-sso-button ${provider.id}-button`}
                onClick={() => handleSSOLogin(provider)}
                aria-label={`Continue with ${provider.name}`}
                style={{
                  '--provider-color': provider.color,
                  '--provider-bg-color': provider.bgColor
                }}
              >
                <div className="sso-button-icon">
                  {provider.icon}
                </div>
                <span className="sso-button-text">{buttonText} {provider.name}</span>
              </button>
            ))
          ) : (
            // Show default providers when none are configured
            <>
              <button
                className="dynamic-sso-button google-button"
                onClick={() => handleSSOLogin({ id: 'google', name: 'Google' })}
                aria-label="Continue with Google"
              >
                <div className="sso-button-icon">
                  <svg className="sso-icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <span className="sso-button-text">{buttonText} Google</span>
              </button>
              
              <button
                className="dynamic-sso-button facebook-button"
                onClick={() => handleSSOLogin({ id: 'facebook', name: 'Facebook' })}
                aria-label="Continue with Facebook"
              >
                <div className="sso-button-icon">
                  <svg className="sso-icon" viewBox="0 0 24 24">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="sso-button-text">{buttonText} Facebook</span>
              </button>
              
              <button
                className="dynamic-sso-button github-button"
                onClick={() => handleSSOLogin({ id: 'github', name: 'GitHub' })}
                aria-label="Continue with GitHub"
              >
                <div className="sso-button-icon">
                  <svg className="sso-icon" viewBox="0 0 24 24">
                    <path fill="#333" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <span className="sso-button-text">{buttonText} GitHub</span>
              </button>
            </>
          )}
        </div>
      </div>

      <SSOEmailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSSO={handleEmailSelect}
        provider={selectedProvider}
      />
    </>
  );
}

export default DynamicSSO;
