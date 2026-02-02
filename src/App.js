import React, { useState, useEffect } from 'react';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import ForgotPassword from './ForgotPassword';
import OTPVerification from './OTPVerification';
import NewPassword from './NewPassword';
import Toast from './Toast';
import database from './database';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('login');
  const [toast, setToast] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [otpEmail, setOtpEmail] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  // Check for OAuth callback on app load
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const authStatus = urlParams.get('auth');

      // Handle OAuth callback
      if (code && state) {
        try {
          console.log('🔄 Handling OAuth callback...');
          const OAuthService = (await import('./sso/OAuthService')).default;
          const userData = await OAuthService.handleOAuthCallback(window.location.href);
          
          console.log('✅ OAuth callback successful:', userData);
          
          // Store user data
          const formattedUser = {
            id: userData.id,
            providerId: `${userData.provider}_${userData.id}`,
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar,
            provider: userData.provider,
            token: userData.tokens?.access_token || `oauth-token-${Date.now()}`,
            emailVerified: userData.emailVerified || true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          
          localStorage.setItem('ssoProvider', userData.provider);
          localStorage.setItem('ssoData', JSON.stringify(formattedUser));
          
          // Set current user
          setCurrentUser({
            email: formattedUser.email,
            name: formattedUser.name,
            avatar: formattedUser.avatar,
            provider: formattedUser.provider,
            token: formattedUser.token
          });
          
          setIsAuthenticated(true);
          showToast('Login successful', 'success');
          
          // Clean URL
          window.history.replaceState({}, document.title, '/');
          
        } catch (error) {
          console.error('OAuth callback error:', error);
          showToast(`Login failed: ${error.message}`, 'error');
          window.history.replaceState({}, document.title, '/');
        }
      }
      
      // Handle auth status from redirect
      if (authStatus === 'success') {
        const ssoUser = localStorage.getItem('ssoUser');
        if (ssoUser) {
          const userData = JSON.parse(ssoUser);
          setCurrentUser({
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar,
            provider: userData.provider
          });
          setIsAuthenticated(true);
          showToast('Login successful', 'success');
        }
        window.history.replaceState({}, document.title, '/');
      } else if (authStatus === 'error') {
        const authError = localStorage.getItem('authError');
        showToast(`Login failed: ${authError || 'Unknown error'}`, 'error');
        localStorage.removeItem('authError');
        window.history.replaceState({}, document.title, '/');
      }
    };

    handleOAuthCallback();
  }, []);

  React.useEffect(() => {
    console.log('🗄️ Database initialized');
    console.log('📧 Test credentials:');
    console.log('   Email: john.doe@gmail.com');
    console.log('   Password: Password123');
    console.log('   Email: jane.smith@gmail.com');
    console.log('   Password: Password123');
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const hideToast = () => {
    setToast(null);
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleLoginSuccess = (email) => {
    const otp = generateOTP();
    setLoginEmail(email);
    setCurrentView('login-otp');
    console.log(`🔐 Login OTP Sent to Gmail!`);
    console.log(`🔐 Gmail Address: ${email}`);
    console.log(`🔐 Login OTP Code: ${otp}`);
    console.log(`🔐 Check your Gmail inbox for this 6-digit verification code`);
  };

  const handleSSO = async (userData) => {
    try {
      console.log(`🚀 Processing SSO authentication...`);
      console.log(`📧 Email: ${userData.email}`);
      
      // SSO authentication
      setIsAuthenticated(true);
      setCurrentView('dashboard');
      
      // Set user profile from SSO
      const userProfile = {
        id: userData.id,
        providerId: userData.providerId || `sso_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        provider: userData.provider || 'sso',
        token: userData.token || `sso-token-${Date.now()}`,
        emailVerified: userData.emailVerified || true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      setCurrentUser(userProfile);
      
      console.log(`🚀 SSO Authentication Successful!`);
      console.log(`🚀 User Profile:`, userProfile);
      console.log(`🚀 Direct dashboard access via SSO`);
      
      // Show success toast
      showToast('Logged in successfully via SSO!', 'success');
    } catch (error) {
      console.error('SSO Error:', error);
      showToast('Failed to login with SSO. Please try again.', 'error');
    }
  };

  const handleForgotPassword = (email) => {
    const otp = generateOTP();
    setResetEmail(email);
    setCurrentView('reset-otp');
    console.log(`🔑 Password Reset OTP Sent to Gmail!`);
    console.log(`🔑 Gmail Address: ${email}`);
    console.log(`🔑 Reset Code: ${otp}`);
    console.log(`🔑 Check your Gmail inbox for this 6-digit password reset code`);
  };

  const handleOTPVerified = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLoginOTPVerified = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    
    // Set current user for manual login
    const user = database.findUserByEmail(loginEmail);
    if (user) {
      setCurrentUser({ name: user.name, email: user.email });
    }
    
    setLoginEmail('');
    
    // Show success toast
    showToast('Logged in successfully!', 'success');
  };

  const handleResetOTPVerified = () => {
    setCurrentView('new-password');
  };

  const handlePasswordReset = () => {
    showToast('Password reset successful! You can now login with your new password.', 'success');
    setCurrentView('login');
    setResetEmail('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
    setOtpEmail('');
    setLoginEmail('');
    setResetEmail('');
    setCurrentUser(null);
    
    // Show logout toast
    showToast('Logged out successfully!', 'success');
  };

  const handleBackToForms = () => {
    if (currentView === 'reset-otp' || currentView === 'new-password') {
      setCurrentView('login');
    } else if (currentView === 'login-otp') {
      setCurrentView('login');
    } else {
      // OTP view is no longer used for SSO, so just go to login
      setCurrentView('login');
    }
  };

  // const handleCancelEmailModal = () => {
  //   // Email modal removed - no longer needed
  // };

  return (
    <div className="App">
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} currentUser={currentUser} />
      ) : currentView === 'login' ? (
        <Login 
          onSwitchToSignup={() => setCurrentView('signup')} 
          onSSO={handleSSO}
          onForgotPassword={() => setCurrentView('forgot-password')}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : currentView === 'signup' ? (
        <Signup 
          onSwitchToLogin={() => setCurrentView('login')} 
          onSSO={handleSSO}
          showToast={showToast}
        />
      ) : currentView === 'forgot-password' ? (
        <ForgotPassword 
          onBack={() => setCurrentView('login')}
          onEmailSubmit={handleForgotPassword}
        />
      ) : currentView === 'login-otp' ? (
        <OTPVerification 
          email={loginEmail}
          onBack={handleBackToForms}
          onVerified={handleLoginOTPVerified}
          onResend={() => {
            const otp = generateOTP();
            console.log(`🔐 Login OTP Resent to Gmail!`);
            console.log(`🔐 Gmail Address: ${loginEmail}`);
            console.log(`🔐 New Login OTP Code: ${otp}`);
            console.log(`🔐 Check your Gmail inbox for this new 6-digit verification code`);
          }}
        />
      ) : currentView === 'reset-otp' ? (
        <OTPVerification 
          email={resetEmail}
          onBack={handleBackToForms}
          onVerified={handleResetOTPVerified}
          onResend={() => {
            const otp = generateOTP();
            console.log(`🔑 Password Reset OTP Resent to Gmail!`);
            console.log(`🔑 Gmail Address: ${resetEmail}`);
            console.log(`🔑 New Reset Code: ${otp}`);
            console.log(`🔑 Check your Gmail inbox for this new 6-digit password reset code`);
          }}
        />
      ) : currentView === 'new-password' ? (
        <NewPassword 
          email={resetEmail}
          onBack={handleBackToForms}
          onPasswordReset={handlePasswordReset}
        />
      ) : (
        // This OTP view is no longer used for SSO, but kept for backward compatibility
        <OTPVerification 
          email={otpEmail}
          onBack={handleBackToForms}
          onVerified={handleOTPVerified}
          onResend={() => {
            const otp = generateOTP();
            console.log(`📧 Gmail OTP Resent!`);
            console.log(`📧 Gmail Address: ${otpEmail}`);
            console.log(`📧 New OTP Code: ${otp}`);
            console.log(`📧 Check your Gmail inbox for this new 6-digit verification code`);
          }}
        />
      )
    }
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default App;
