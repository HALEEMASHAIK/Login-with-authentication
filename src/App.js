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
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [otpEmail, setOtpEmail] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isLoginVerified, setIsLoginVerified] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [showOTPNotification, setShowOTPNotification] = useState(false);
  const [otpNotificationData, setOtpNotificationData] = useState({});
  const [toast, setToast] = useState(null);

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

  const handleSSO = (email) => {
    // SSO login/signup - direct access without authentication or email input
    setIsAuthenticated(true);
    setIsLoginVerified(true);
    setCurrentView('dashboard');
    console.log(`🚀 SSO Access Granted!`);
    console.log(`🚀 Direct dashboard access via SSO (no email input or OTP required)`);
    
    // Show success toast
    showToast('Logged in successfully via Google SSO!', 'success');
  };

  const handleEmailSubmit = (email) => {
    // SSO with email input - direct access without authentication
    setIsAuthenticated(true);
    setIsLoginVerified(true);
    // setShowEmailModal(false);
    setCurrentView('dashboard');
    console.log(`🚀 SSO Access Granted!`);
    console.log(`🚀 Gmail Address: ${email}`);
    console.log(`🚀 Direct dashboard access via SSO (no OTP required)`);
    
    // Show success toast
    showToast('Logged in successfully via Google SSO!', 'success');
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

  const handleCancelEmailModal = () => {
    // Email modal removed - no longer needed
  };

  const handleCloseOTPNotification = () => {
    setShowOTPNotification(false);
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
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
