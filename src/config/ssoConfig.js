// Dynamic SSO Configuration
// This file can be extended to load providers from API or environment variables

export const ssoConfig = {
  // Enable/disable specific providers
  enabledProviders: ['google', 'facebook', 'github'],
  
  // Provider configurations
  providers: {
    google: {
      id: 'google',
      name: 'Google',
      enabled: true,
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      scopes: ['email', 'profile'],
      redirectUri: `${window.location.origin}/auth/google/callback`,
      icon: 'google-icon-svg',
      color: '#4285f4',
      bgColor: '#e8f0fe'
    },
    
    facebook: {
      id: 'facebook',
      name: 'Facebook',
      enabled: true,
      clientId: process.env.REACT_APP_FACEBOOK_CLIENT_ID,
      scopes: ['email', 'public_profile'],
      redirectUri: `${window.location.origin}/auth/facebook/callback`,
      icon: 'facebook-icon-svg',
      color: '#1877f2',
      bgColor: '#e7f3ff'
    },
    
    github: {
      id: 'github',
      name: 'GitHub',
      enabled: true,
      clientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
      scopes: ['user:email'],
      redirectUri: `${window.location.origin}/auth/github/callback`,
      icon: 'github-icon-svg',
      color: '#333',
      bgColor: '#f6f8fa'
    },
    
    // Example of custom provider
    microsoft: {
      id: 'microsoft',
      name: 'Microsoft',
      enabled: false, // Disabled by default
      clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID,
      scopes: ['email', 'openid', 'profile'],
      redirectUri: `${window.location.origin}/auth/microsoft/callback`,
      icon: 'microsoft-icon-svg',
      color: '#00a1f1',
      bgColor: '#e6f7ff'
    },
    
    // Example of enterprise provider
    okta: {
      id: 'okta',
      name: 'Okta',
      enabled: false, // Disabled by default
      clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
      domain: process.env.REACT_APP_OKTA_DOMAIN,
      scopes: ['email', 'openid', 'profile'],
      redirectUri: `${window.location.origin}/auth/okta/callback`,
      icon: 'okta-icon-svg',
      color: '#007dc3',
      bgColor: '#e6f3ff'
    }
  },
  
  // Global SSO settings
  settings: {
    // Auto-redirect to SSO if only one provider is enabled
    autoRedirect: false,
    
    // Show provider selection screen
    showProviderSelection: true,
    
    // Enable remember me functionality
    enableRememberMe: true,
    
    // Session timeout in minutes
    sessionTimeout: 30,
    
    // Enable debug mode
    debug: process.env.NODE_ENV === 'development',
    
    // Custom authentication endpoint
    authEndpoint: process.env.REACT_APP_AUTH_ENDPOINT || '/api/auth',
    
    // Custom user info endpoint
    userInfoEndpoint: process.env.REACT_APP_USER_INFO_ENDPOINT || '/api/user/info'
  }
};

// Dynamic provider loader
export const loadProviders = async () => {
  try {
    // Try to load from API endpoint first
    const response = await fetch(`${ssoConfig.settings.authEndpoint  }/providers`);
    
    if (response.ok) {
      const apiProviders = await response.json();
      return mergeProviders(apiProviders);
    }
  } catch (error) {
    console.warn('Failed to load providers from API, using configuration:', error);
  }
  
  // Fallback to configuration
  return getEnabledProviders();
};

// Merge API providers with configuration
const mergeProviders = (apiProviders) => {
  return apiProviders.map(apiProvider => {
    const configProvider = ssoConfig.providers[apiProvider.id];
    return {
      ...configProvider,
      ...apiProvider,
      // Preserve configuration defaults
      color: apiProvider.color || configProvider.color,
      bgColor: apiProvider.bgColor || configProvider.bgColor
    };
  });
};

// Get enabled providers from configuration
export const getEnabledProviders = () => {
  return Object.values(ssoConfig.providers)
    .filter(provider => provider.enabled && ssoConfig.enabledProviders.includes(provider.id));
};

// Get provider by ID
export const getProvider = (providerId) => {
  return ssoConfig.providers[providerId];
};

// Check if provider is enabled
export const isProviderEnabled = (providerId) => {
  const provider = ssoConfig.providers[providerId];
  return provider && provider.enabled && ssoConfig.enabledProviders.includes(providerId);
};

// Enable/disable provider dynamically
export const setProviderEnabled = (providerId, enabled) => {
  const provider = ssoConfig.providers[providerId];
  if (provider) {
    provider.enabled = enabled;
    
    if (enabled && !ssoConfig.enabledProviders.includes(providerId)) {
      ssoConfig.enabledProviders.push(providerId);
    } else if (!enabled) {
      const index = ssoConfig.enabledProviders.indexOf(providerId);
      if (index > -1) {
        ssoConfig.enabledProviders.splice(index, 1);
      }
    }
  }
};

// Add custom provider dynamically
export const addCustomProvider = (providerConfig) => {
  ssoConfig.providers[providerConfig.id] = {
    enabled: true,
    ...providerConfig
  };
  
  if (!ssoConfig.enabledProviders.includes(providerConfig.id)) {
    ssoConfig.enabledProviders.push(providerConfig.id);
  }
};

// Remove provider dynamically
export const removeProvider = (providerId) => {
  delete ssoConfig.providers[providerId];
  
  const index = ssoConfig.enabledProviders.indexOf(providerId);
  if (index > -1) {
    ssoConfig.enabledProviders.splice(index, 1);
  }
};

// Load providers from environment variables
export const loadProvidersFromEnv = () => {
  const envProviders = [];
  
  // Check for environment variable enabled providers
  const envEnabledProviders = process.env.REACT_APP_SSO_PROVIDERS?.split(',') || [];
  
  if (envEnabledProviders.length > 0) {
    envEnabledProviders.forEach(providerId => {
      const provider = ssoConfig.providers[providerId.trim()];
      if (provider) {
        envProviders.push({
          ...provider,
          enabled: true
        });
      }
    });
  } else {
    // Use default enabled providers
    envProviders.push(...getEnabledProviders());
  }
  
  return envProviders;
};

// Initialize providers from multiple sources
export const initializeProviders = async () => {
  try {
    // Priority order: API -> Environment -> Configuration
    let providers = [];
    
    // Try API first
    try {
      providers = await loadProviders();
      if (providers.length > 0) {
        console.log('Loaded providers from API:', providers.map(p => p.id));
        return providers;
      }
    } catch (apiError) {
      console.warn('API provider loading failed:', apiError);
    }
    
    // Try environment variables
    try {
      providers = loadProvidersFromEnv();
      if (providers.length > 0) {
        console.log('Loaded providers from environment:', providers.map(p => p.id));
        return providers;
      }
    } catch (envError) {
      console.warn('Environment provider loading failed:', envError);
    }
    
    // Fallback to configuration
    providers = getEnabledProviders();
    console.log('Loaded providers from configuration:', providers.map(p => p.id));
    return providers;
    
  } catch (error) {
    console.error('All provider loading methods failed:', error);
    return [];
  }
};

export default ssoConfig;
