import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import OTPVerification from './OTPVerification';
import Dashboard from './Dashboard';
import ForgotPassword from './ForgotPassword';
import NewPassword from './NewPassword';
import OTPNotification from './OTPNotification';
import Toast from './Toast';
import database from './database';
import userAPI from './api/userApi';
import authAPI from './api/authApi';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [otpEmail, setOtpEmail] = useState('');
  const [, setGeneratedOTP] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [, setIsLoginVerified] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [showOTPNotification, setShowOTPNotification] = useState(false);
  const [otpNotificationData, setOtpNotificationData] = useState({});
  const [toast, setToast] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize database and show test credentials
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

  const showOTPNotificationPopup = (otp, email, type) => {
    setOtpNotificationData({ otp, email, type });
    setShowOTPNotification(true);
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleLoginSuccess = (email) => {
    const otp = generateOTP();
    setGeneratedOTP(otp);
    setLoginEmail(email);
    setCurrentView('login-otp');
    console.log(`🔐 Login OTP Sent to Gmail!`);
    console.log(`🔐 Gmail Address: ${email}`);
    console.log(`🔐 Login OTP Code: ${otp}`);
    console.log(`🔐 Check your Gmail inbox for this 6-digit verification code`);
    
    // Show OTP notification popup
    showOTPNotificationPopup(otp, email, 'login');
  };

  const handleSSO = async (email) => {
    try {
      // Get SSO provider from localStorage (set by SSOButtons component)
      const ssoProvider = localStorage.getItem('ssoProvider') || 'google';
      const ssoData = JSON.parse(localStorage.getItem('ssoData') || '{}');
      
      console.log(`🚀 Processing SSO login for ${ssoProvider}...`);
      console.log(`📧 Email: ${email}`);
      
      // SSO login/signup - integrate with real API
      setIsAuthenticated(true);
      setCurrentView('dashboard');
      
      // Get user profile from SSO API or use Firebase data
      let userProfile;
      if (ssoData.id) {
        // Use Firebase user data
        userProfile = await getSSOUserProfileFromAPI(email, ssoData);
      } else {
        // Fallback to mock data
        userProfile = await getSSOUserProfileFromAPI(email);
      }
      
      setCurrentUser(userProfile);
      
      // Store auth token
      authAPI.setAuthToken(userProfile.token || 'mock-token', true);
      
      console.log(`🚀 SSO Access Granted!`);
      console.log(`🚀 User Profile:`, userProfile);
      console.log(`🚀 Direct dashboard access via ${ssoProvider} SSO`);
      
      // Show success toast
      showToast(`Logged in successfully via ${ssoProvider.charAt(0).toUpperCase() + ssoProvider.slice(1)} SSO!`, 'success');
    } catch (error) {
      console.error('SSO Error:', error);
      showToast('Failed to login with SSO. Please try again.', 'error');
    }
  };

  // Get SSO user profile from API
  const getSSOUserProfileFromAPI = async (email, firebaseData = null) => {
    try {
      // Get SSO provider from localStorage (set by SSOButtons component)
      const ssoProvider = localStorage.getItem('ssoProvider') || 'google';
      const ssoData = firebaseData || JSON.parse(localStorage.getItem('ssoData') || '{}');
      
      // Try to get SSO user profile from API
      const userProfile = await userAPI.getSSOUserProfile(ssoProvider, 'mock-sso-token');
      
      // If user doesn't exist, create/update SSO user
      if (!userProfile || userProfile.error) {
        const newSSOData = {
          provider: ssoProvider,
          providerId: ssoData.providerId || `${ssoProvider}_${Date.now()}`,
          email,
          name: ssoData.name || email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          avatar: ssoData.avatar || `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=667eea&color=fff`,
          token: ssoData.token || `mock-jwt-token-${  Date.now()}`,
          emailVerified: ssoData.emailVerified || false,
          createdAt: ssoData.createdAt || new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        
        const createdUser = await userAPI.createOrUpdateSSOUser(newSSOData);
        
        // Clear SSO data from localStorage
        localStorage.removeItem('ssoProvider');
        localStorage.removeItem('ssoData');
        
        return createdUser;
      }
      
      return userProfile;
    } catch (error) {
      console.log('SSO API not available, using mock data:', error.message);
      
      // Get SSO provider from localStorage for fallback
      const ssoProvider = localStorage.getItem('ssoProvider') || 'google';
      const ssoData = firebaseData || JSON.parse(localStorage.getItem('ssoData') || '{}');
      
      // Clear SSO data from localStorage
      localStorage.removeItem('ssoProvider');
      localStorage.removeItem('ssoData');
      
      // Fallback to mock SSO data for development
      return {
        id: ssoData.id || Math.random().toString(36).substr(2, 9),
        providerId: ssoData.providerId || `${ssoProvider}_${Date.now()}`,
        name: ssoData.name || email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email,
        avatar: ssoData.avatar || `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=667eea&color=fff`,
        provider: ssoProvider,
        token: ssoData.token || `mock-jwt-token-${  Date.now()}`,
        accessToken: ssoData.accessToken || `mock-access-token-${  Date.now()}`,
        refreshToken: ssoData.refreshToken || `mock-refresh-token-${  Date.now()}`,
        expiresIn: ssoData.expiresIn || 3600,
        emailVerified: ssoData.emailVerified || false,
        createdAt: ssoData.createdAt || new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
    }
  };

  const handleForgotPassword = (email) => {
    const otp = generateOTP();
    setGeneratedOTP(otp);
    setResetEmail(email);
    setCurrentView('reset-otp');
    console.log(`🔑 Password Reset OTP Sent to Gmail!`);
    console.log(`🔑 Gmail Address: ${email}`);
    console.log(`🔑 Reset Code: ${otp}`);
    console.log(`🔑 Check your Gmail inbox for this 6-digit password reset code`);
    
    // Show OTP notification popup
    showOTPNotificationPopup(otp, email, 'reset');
  };

  const handleOTPVerified = () => {
    setIsAuthenticated(true);
    setIsLoginVerified(true);
    setCurrentView('dashboard');
    setGeneratedOTP('');
  };

  const handleLoginOTPVerified = () => {
    setIsAuthenticated(true);
    setIsLoginVerified(true);
    setCurrentView('dashboard');
    setGeneratedOTP('');
    
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
    setGeneratedOTP('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsLoginVerified(false);
    setCurrentView('login');
    setOtpEmail('');
    setGeneratedOTP('');
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

  const handleCloseOTPNotification = () => {
    setShowOTPNotification(false);
  };

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
            setGeneratedOTP(otp);
            console.log(`🔐 Login OTP Resent to Gmail!`);
            console.log(`🔐 Gmail Address: ${loginEmail}`);
            console.log(`🔐 New Login OTP Code: ${otp}`);
            console.log(`🔐 Check your Gmail inbox for this new 6-digit verification code`);
            
            // Show OTP notification popup
            showOTPNotificationPopup(otp, loginEmail, 'login');
          }}
        />
      ) : currentView === 'reset-otp' ? (
        <OTPVerification 
          email={resetEmail}
          onBack={handleBackToForms}
          onVerified={handleResetOTPVerified}
          onResend={() => {
            const otp = generateOTP();
            setGeneratedOTP(otp);
            console.log(`🔑 Password Reset OTP Resent to Gmail!`);
            console.log(`🔑 Gmail Address: ${resetEmail}`);
            console.log(`🔑 New Reset Code: ${otp}`);
            console.log(`🔑 Check your Gmail inbox for this new 6-digit password reset code`);
            
            // Show OTP notification popup
            showOTPNotificationPopup(otp, resetEmail, 'reset');
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
            setGeneratedOTP(otp);
            console.log(`📧 Gmail OTP Resent!`);
            console.log(`📧 Gmail Address: ${otpEmail}`);
            console.log(`📧 New OTP Code: ${otp}`);
            console.log(`📧 Check your Gmail inbox for this new 6-digit verification code`);
            
            // Show OTP notification popup
            showOTPNotificationPopup(otp, otpEmail, 'sso');
          }}
        />
      )}
      
      {showOTPNotification && (
        <OTPNotification
          otp={otpNotificationData.otp}
          email={otpNotificationData.email}
          type={otpNotificationData.type}
          onClose={handleCloseOTPNotification}
        />
      )}
      
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
