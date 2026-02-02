import React, { useEffect } from 'react';
import OAuthService from '../sso/OAuthService';

function OAuthCallback() {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get current URL
        const currentUrl = window.location.href;
        
        // Handle OAuth callback
        const userData = await OAuthService.handleOAuthCallback(currentUrl);
        
        // Store user data
        localStorage.setItem('ssoUser', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Redirect to main app
        window.location.href = '/?auth=success';
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        
        // Store error for main app to handle
        localStorage.setItem('authError', error.message);
        
        // Redirect to main app with error
        window.location.href = '/?auth=error';
      }
    };

    handleCallback();
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Processing Authentication...</h2>
        <p>Please wait while we complete your sign-in.</p>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          margin: '20px auto',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default OAuthCallback;
